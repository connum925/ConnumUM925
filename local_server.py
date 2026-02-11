"""
Simple local development server for testing the portfolio before Netlify deployment.
This serves both static files and simulates the API endpoints.
"""

import http.server
import socketserver
import json
import os
from pathlib import Path
from urllib.parse import parse_qs, urlparse
import html
import re
from datetime import datetime

PORT = 8000
FRONTEND_DIR = Path(__file__).parent / 'frontend'
BACKEND_DATA_DIR = Path(__file__).parent / 'backend' / 'data'

# Simple in-memory rate limiting
rate_limit_store = {}

class PortfolioRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(FRONTEND_DIR), **kwargs)

    def end_headers(self):
        # Add CORS headers for API requests
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

    def do_OPTIONS(self):
        """Handle preflight requests"""
        self.send_response(200)
        self.end_headers()

    def do_GET(self):
        """Handle GET requests"""
        parsed_path = urlparse(self.path)

        # API endpoints
        if parsed_path.path.startswith('/.netlify/functions/'):
            endpoint = parsed_path.path.replace('/.netlify/functions/', '')
            self.handle_api_get(endpoint)
        else:
            # Serve static files
            super().do_GET()

    def do_POST(self):
        """Handle POST requests"""
        parsed_path = urlparse(self.path)

        if parsed_path.path == '/.netlify/functions/contact':
            self.handle_contact_post()
        else:
            self.send_error(404, "Not Found")

    def handle_api_get(self, endpoint):
        """Handle API GET requests"""
        # Map endpoint to JSON file
        json_files = {
            'profile': 'profile.json',
            'experience': 'experience.json',
            'education': 'education.json',
            'skills': 'skills.json',
            'certificates': 'certificates.json',
            'projects': 'projects.json'
        }

        if endpoint not in json_files:
            self.send_error(404, f"Endpoint not found: {endpoint}")
            return

        json_file = BACKEND_DATA_DIR / json_files[endpoint]

        if not json_file.exists():
            self.send_error(500, f"Data file not found: {json_file}")
            return

        try:
            with open(json_file, 'r', encoding='utf-8') as f:
                data = json.load(f)

            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(data, ensure_ascii=False).encode('utf-8'))

        except Exception as e:
            self.send_error(500, f"Error reading data: {str(e)}")

    def handle_contact_post(self):
        """Handle contact form submission"""
        try:
            # Read request body
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))

            # Validate and sanitize
            name = self.sanitize_input(data.get('name', ''), 100)
            email = self.sanitize_input(data.get('email', ''), 254)
            subject = self.sanitize_input(data.get('subject', ''), 150)
            message = self.sanitize_input(data.get('message', ''), 4000)

            errors = {}

            if not name or len(name) < 2:
                errors['name'] = 'Name must be at least 2 characters'

            if not email or not self.validate_email(email):
                errors['email'] = 'Invalid email format'

            if not subject or len(subject) < 3:
                errors['subject'] = 'Subject must be at least 3 characters'

            if not message or len(message) < 10:
                errors['message'] = 'Message must be at least 10 characters'

            if errors:
                self.send_response(400)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({
                    'error': {
                        'code': 'VALIDATION_ERROR',
                        'message': 'Validation failed',
                        'details': errors
                    }
                }, ensure_ascii=False).encode('utf-8'))
                return

            # Rate limiting (simple)
            client_ip = self.client_address[0]
            if client_ip in rate_limit_store and rate_limit_store[client_ip] >= 5:
                self.send_response(429)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({
                    'error': {
                        'code': 'RATE_LIMIT_EXCEEDED',
                        'message': 'Too many submissions. Please try again later.'
                    }
                }).encode('utf-8'))
                return

            rate_limit_store[client_ip] = rate_limit_store.get(client_ip, 0) + 1

            # Store message
            message_data = {
                'timestamp': datetime.utcnow().isoformat() + 'Z',
                'name': name,
                'email': email,
                'subject': subject,
                'message': message,
                'metadata': {
                    'userAgent': self.headers.get('User-Agent', ''),
                    'ip': client_ip
                }
            }

            messages_file = BACKEND_DATA_DIR / 'messages.jsonl'
            messages_file.parent.mkdir(parents=True, exist_ok=True)

            with open(messages_file, 'a', encoding='utf-8') as f:
                f.write(json.dumps(message_data, ensure_ascii=False) + '\n')

            print(f"\n[CONTACT FORM] New message from {name} ({email})")
            print(f"Subject: {subject}")
            print(f"Message saved to {messages_file}\n")

            # Success response
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'ok': True}).encode('utf-8'))

        except json.JSONDecodeError:
            self.send_response(400)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({
                'error': {
                    'code': 'INVALID_JSON',
                    'message': 'Invalid JSON in request body'
                }
            }).encode('utf-8'))

        except Exception as e:
            print(f"Error processing contact form: {str(e)}")
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({
                'error': {
                    'code': 'INTERNAL_ERROR',
                    'message': 'An error occurred processing your request'
                }
            }).encode('utf-8'))

    @staticmethod
    def sanitize_input(text, max_length):
        """Sanitize text input"""
        if not text:
            return ""
        text = str(text)[:max_length]
        text = html.escape(text)
        text = re.sub(r'<script[^>]*>.*?</script>', '', text, flags=re.IGNORECASE | re.DOTALL)
        return text.strip()

    @staticmethod
    def validate_email(email):
        """Validate email format"""
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return re.match(pattern, email) is not None

    def log_message(self, format, *args):
        """Custom log format"""
        # Only log API calls and errors, not every static file
        if '/.netlify/functions/' in args[0] or 'code 404' in format or 'code 500' in format:
            super().log_message(format, *args)

def main():
    # Check if data files exist
    if not BACKEND_DATA_DIR.exists():
        print(f"ERROR: Backend data directory not found: {BACKEND_DATA_DIR}")
        print("Please run: python backend/scripts/generate_content.py")
        return

    required_files = ['profile.json', 'experience.json', 'education.json',
                      'skills.json', 'certificates.json', 'projects.json']

    missing_files = [f for f in required_files if not (BACKEND_DATA_DIR / f).exists()]

    if missing_files:
        print("ERROR: Missing data files:")
        for f in missing_files:
            print(f"  - backend/data/{f}")
        print("\nPlease run: python backend/scripts/generate_content.py")
        return

    print("=" * 60)
    print("  PORTFOLIO LOCAL DEVELOPMENT SERVER")
    print("=" * 60)
    print(f"\nServing frontend from: {FRONTEND_DIR}")
    print(f"Serving API data from: {BACKEND_DATA_DIR}")
    print(f"\nServer running at: http://localhost:{PORT}")
    print("\nAvailable API endpoints:")
    print(f"  - http://localhost:{PORT}/.netlify/functions/profile")
    print(f"  - http://localhost:{PORT}/.netlify/functions/experience")
    print(f"  - http://localhost:{PORT}/.netlify/functions/education")
    print(f"  - http://localhost:{PORT}/.netlify/functions/skills")
    print(f"  - http://localhost:{PORT}/.netlify/functions/certificates")
    print(f"  - http://localhost:{PORT}/.netlify/functions/projects")
    print(f"  - http://localhost:{PORT}/.netlify/functions/contact (POST)")
    print("\nPress Ctrl+C to stop the server")
    print("=" * 60)
    print()

    with socketserver.TCPServer(("", PORT), PortfolioRequestHandler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\nServer stopped by user")
            print("Goodbye!")

if __name__ == "__main__":
    main()

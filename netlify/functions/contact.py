import json
import re
from pathlib import Path
from datetime import datetime
import html

# Simple in-memory rate limiting (resets on function cold start)
rate_limit_store = {}

def sanitize_input(text, max_length):
    """Sanitize text input to prevent injection attacks"""
    if not text:
        return ""
    # Truncate to max length
    text = str(text)[:max_length]
    # Escape HTML entities
    text = html.escape(text)
    # Remove any script tags or javascript
    text = re.sub(r'<script[^>]*>.*?</script>', '', text, flags=re.IGNORECASE | re.DOTALL)
    return text.strip()

def validate_email(email):
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def check_rate_limit(ip):
    """Simple rate limiting: max 5 submissions per IP per function instance"""
    if ip in rate_limit_store:
        if rate_limit_store[ip] >= 5:
            return False
        rate_limit_store[ip] += 1
    else:
        rate_limit_store[ip] = 1
    return True

def handler(event, context):
    """Handle contact form submissions"""

    # Only allow POST
    if event['httpMethod'] != 'POST':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': json.dumps({
                'error': {
                    'code': 'METHOD_NOT_ALLOWED',
                    'message': 'Only POST method is allowed'
                }
            })
        }

    # Handle preflight
    if event['httpMethod'] == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': ''
        }

    try:
        # Parse request body
        body = json.loads(event['body'])

        # Extract and validate fields
        name = sanitize_input(body.get('name', ''), 100)
        email = sanitize_input(body.get('email', ''), 254)
        subject = sanitize_input(body.get('subject', ''), 150)
        message = sanitize_input(body.get('message', ''), 4000)

        # Validation
        errors = {}

        if not name or len(name) < 2:
            errors['name'] = 'Name must be at least 2 characters'

        if not email:
            errors['email'] = 'Email is required'
        elif not validate_email(email):
            errors['email'] = 'Invalid email format'

        if not subject or len(subject) < 3:
            errors['subject'] = 'Subject must be at least 3 characters'

        if not message or len(message) < 10:
            errors['message'] = 'Message must be at least 10 characters'

        if errors:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'error': {
                        'code': 'VALIDATION_ERROR',
                        'message': 'Validation failed',
                        'details': errors
                    }
                })
            }

        # Rate limiting
        client_ip = event.get('headers', {}).get('x-forwarded-for', 'unknown').split(',')[0]
        if not check_rate_limit(client_ip):
            return {
                'statusCode': 429,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'error': {
                        'code': 'RATE_LIMIT_EXCEEDED',
                        'message': 'Too many submissions. Please try again later.'
                    }
                })
            }

        # Prepare message data
        message_data = {
            'timestamp': datetime.utcnow().isoformat() + 'Z',
            'name': name,
            'email': email,
            'subject': subject,
            'message': message,
            'metadata': {
                'userAgent': event.get('headers', {}).get('user-agent', ''),
                'ip': client_ip
            }
        }

        # Store to messages.jsonl
        messages_file = Path(__file__).parent.parent.parent / 'backend' / 'data' / 'messages.jsonl'
        messages_file.parent.mkdir(parents=True, exist_ok=True)

        with open(messages_file, 'a', encoding='utf-8') as f:
            f.write(json.dumps(message_data, ensure_ascii=False) + '\n')

        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'ok': True})
        }

    except json.JSONDecodeError:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'error': {
                    'code': 'INVALID_JSON',
                    'message': 'Invalid JSON in request body'
                }
            })
        }
    except Exception as e:
        # Log error but don't expose internals
        print(f"Error processing contact form: {str(e)}")
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'error': {
                    'code': 'INTERNAL_ERROR',
                    'message': 'An error occurred processing your request'
                }
            })
        }

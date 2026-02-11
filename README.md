# Connor Urbano Mendoza - Portfolio Website

A modern, responsive, and accessible personal portfolio website built with vanilla HTML5, CSS3, JavaScript, and Bootstrap 5. The site features bilingual support (English/Spanish), light/dark theme switching, and smooth animations.

## Features

- **Bilingual Support**: Complete English/Spanish translation with localStorage persistence
- **Theme Switching**: Light/dark mode with system preference detection and persistence
- **Fully Responsive**: Mobile-first design that works on all devices
- **Accessible**: WCAG 2.1 compliant with semantic HTML, ARIA labels, keyboard navigation
- **Performance Optimized**: Lazy loading, IntersectionObserver animations, respects `prefers-reduced-motion`
- **20 Projects**: Showcasing 3 real projects with 17 additional placeholders
- **Project Filtering**: Search and filter projects by technology
- **Contact Form**: Functional contact form with validation and backend storage
- **SEO Ready**: Semantic markup, meta tags, and clean URLs

## Technology Stack

### Frontend
- **HTML5**: Semantic markup for accessibility
- **CSS3**: Custom properties for theming, flexbox/grid layouts
- **JavaScript ES6+**: Modular code with ES modules
- **Bootstrap 5**: Responsive grid and components

### Backend
- **Netlify Functions**: Serverless Python functions for API endpoints
- **Python 3.9+**: Data generation and API logic
- **JSON/JSONL**: Flat-file data storage

### Hosting
- **Netlify**: CDN, serverless functions, automatic deployments

## Prerequisites

- **Python 3.9+** (for local development and data generation)
- **Modern web browser** (Chrome, Firefox, Safari, Edge)
- **Netlify account** (for deployment)

## Local Development

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd ConnumUM925
```

### 2. Generate Content Data

Run the content generation script to create JSON data files from the resume:

```bash
python backend/scripts/generate_content.py
```

This will create the following files in `backend/data/`:
- `profile.json` - Personal information and contact details
- `experience.json` - Work experience
- `education.json` - Education background
- `skills.json` - Technical and interpersonal skills
- `certificates.json` - Certifications
- `projects.json` - 20 projects (3 real + 17 placeholders)

### 3. Run Local Development Server

**Recommended: Use the included Python server (no additional tools needed)**

```bash
python local_server.py
```

This will:
- Serve the frontend from the `frontend/` directory
- Simulate all Netlify Functions API endpoints
- Enable the contact form
- Open at `http://localhost:8000`

**All your data will load correctly** and you can test everything before deploying to Netlify.

### Alternative: Netlify CLI (Optional)

If you want to test in an environment identical to production:

```bash
# Install Netlify CLI globally
npm install -g netlify-cli

# Run local development server
netlify dev
```

This will open the site at `http://localhost:8888`

**Note:** Do NOT use `python -m http.server` alone - it won't serve the API endpoints and your data will show as "Loading..."

## Project Structure

```
ConnumUM925/
├── backend/
│   ├── data/                    # Generated JSON data files (gitignored)
│   │   ├── profile.json
│   │   ├── experience.json
│   │   ├── education.json
│   │   ├── skills.json
│   │   ├── certificates.json
│   │   ├── projects.json
│   │   └── messages.jsonl       # Contact form submissions
│   └── scripts/
│       └── generate_content.py  # Content generation from resume
│
├── frontend/
│   ├── index.html               # Main page
│   ├── project.html             # Project detail page
│   ├── assets/
│   │   ├── css/
│   │   │   └── styles.css       # All styles with CSS variables
│   │   └── js/
│   │       ├── main.js          # Main application logic
│   │       ├── project-detail.js # Project detail page logic
│   │       ├── i18n.js          # Internationalization module
│   │       ├── api.js           # API client module
│   │       ├── theme.js         # Theme switching module
│   │       └── animations.js    # Animation module
│   └── media/
│       └── projects/            # Project media files
│           ├── sweet-style/
│           ├── fluvi-traffic/
│           ├── file-explorer/
│           └── placeholder/     # Generic placeholder images
│
├── netlify/
│   └── functions/               # Serverless API endpoints
│       ├── profile.py
│       ├── experience.py
│       ├── education.py
│       ├── skills.py
│       ├── certificates.py
│       ├── projects.py
│       └── contact.py
│
├── netlify.toml                 # Netlify configuration
├── runtime.txt                  # Python version
├── .gitignore
├── resume_data.txt              # Source resume data
└── README.md
```

## Deployment to Netlify

### Option 1: Connect Git Repository (Recommended)

1. Push your code to GitHub/GitLab/Bitbucket
2. Log in to [Netlify](https://app.netlify.com)
3. Click "New site from Git"
4. Select your repository
5. Configure build settings:
   - **Build command**: `python backend/scripts/generate_content.py`
   - **Publish directory**: `frontend`
   - **Functions directory**: `netlify/functions`
6. Click "Deploy site"

Netlify will automatically:
- Run the build command to generate data files
- Deploy your frontend
- Set up serverless functions
- Provide a URL (e.g., `https://your-site-name.netlify.app`)

### Option 2: Manual Deploy with Netlify CLI

```bash
# Login to Netlify
netlify login

# Initialize the site
netlify init

# Deploy
netlify deploy --prod
```

### Environment Variables

No environment variables are required for basic functionality. The contact form stores messages to `backend/data/messages.jsonl`.

### Custom Domain

To use a custom domain:
1. Go to your site settings in Netlify
2. Navigate to "Domain management"
3. Click "Add custom domain"
4. Follow the DNS configuration instructions

## Customization Guide

### Updating Profile Information

Edit `resume_data.txt` with your information, then regenerate data:

```bash
python backend/scripts/generate_content.py
```

### Adding Real Projects

1. Edit `backend/scripts/generate_content.py`
2. Add your project to the `generate_projects()` function
3. Add media files to `frontend/media/projects/<project-slug>/`
4. Regenerate data:

```bash
python backend/scripts/generate_content.py
```

### Adding Personal Images (About Section)

The About section includes a personal photo gallery with automatic image detection:

1. **Add your 3 personal images to:**
   ```
   frontend/assets/images/about/
   ```

2. **Name your images:**
   - `me1.jpg` (or .jpeg, .png, .webp)
   - `me2.jpg` (or .jpeg, .png, .webp)
   - `me3.jpg` (or .jpeg, .png, .webp)

3. **The system automatically:**
   - Detects which extension you use (tries webp → jpg → jpeg → png)
   - Shows elegant placeholders for missing images
   - Supports bilingual captions (EN/ES)
   - Maintains aspect ratio and responsive layout

4. **Image recommendations:**
   - Format: JPG or WebP (best performance)
   - Size: 800x800px minimum
   - File size: Keep under 500KB each
   - Optimize with TinyPNG.com or similar

**No code changes needed!** Just drop your images in the folder with the correct names.

### Replacing Placeholder Media (Projects)

Navigate to the project's media folder and replace the placeholder images:

```
frontend/media/projects/<project-slug>/
├── screenshot-1.jpg     # Replace with actual screenshot
├── screenshot-2.jpg     # Add more images
└── demo.mp4             # Add video (keep under 10MB)
```

Then update the media array in the project's data in `generate_content.py`.

### Editing Translations

All UI translations are in `frontend/assets/js/i18n.js`. To add or modify translations:

```javascript
const translations = {
    en: {
        // English translations
        nav: {
            about: "About",
            // ...
        }
    },
    es: {
        // Spanish translations
        nav: {
            about: "Acerca de",
            // ...
        }
    }
};
```

For dynamic content (API data), translations are stored in the JSON files as bilingual objects:

```json
{
    "title": {
        "en": "Software Engineer",
        "es": "Ingeniero de Software"
    }
}
```

### Customizing Theme Colors

Edit CSS variables in `frontend/assets/css/styles.css`:

```css
:root {
    --primary-color: #0d6efd;      /* Change primary color */
    --bg-primary: #ffffff;         /* Light mode background */
    /* ... */
}

[data-theme="dark"] {
    --primary-color: #4d9eff;      /* Dark mode primary color */
    --bg-primary: #1a1a1a;         /* Dark mode background */
    /* ... */
}
```

### Modifying Contact Form Storage

Contact messages are stored in `backend/data/messages.jsonl`. To change storage or add email notifications:

1. Edit `netlify/functions/contact.py`
2. Add email sending logic (e.g., using SendGrid API)
3. Or integrate with a service like Formspree, Netlify Forms, etc.

## API Endpoints

All endpoints are available at `/.netlify/functions/<endpoint>`:

- `GET /.netlify/functions/profile` - Returns profile data
- `GET /.netlify/functions/experience` - Returns experience data
- `GET /.netlify/functions/education` - Returns education data
- `GET /.netlify/functions/skills` - Returns skills data
- `GET /.netlify/functions/certificates` - Returns certificates data
- `GET /.netlify/functions/projects` - Returns all projects
- `POST /.netlify/functions/contact` - Submit contact form

### Contact Form API

**Request:**
```json
POST /.netlify/functions/contact
Content-Type: application/json

{
    "name": "John Doe",
    "email": "john@example.com",
    "subject": "Job Opportunity",
    "message": "I would like to discuss..."
}
```

**Response (Success):**
```json
{
    "ok": true
}
```

**Response (Error):**
```json
{
    "error": {
        "code": "VALIDATION_ERROR",
        "message": "Validation failed",
        "details": {
            "email": "Invalid email format"
        }
    }
}
```

## Accessibility Features

- Semantic HTML5 landmarks (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`)
- Skip-to-content link for keyboard navigation
- ARIA labels where appropriate
- Keyboard navigable (tab, enter, space)
- Focus visible styles
- Alt text for all images
- Proper heading hierarchy
- Color contrast meets WCAG AA standards
- Respects `prefers-reduced-motion`
- Screen reader friendly

## Performance Optimizations

- **Lazy Loading**: Images use `loading="lazy"` attribute
- **IntersectionObserver**: Animations trigger only when visible
- **Minimal Dependencies**: No heavy frameworks
- **CDN Assets**: Bootstrap loaded from CDN with caching
- **Optimized Media**: Videos use `preload="metadata"`
- **CSS Variables**: Efficient theme switching
- **Modular JS**: ES modules for better code splitting

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Security Features

- XSS Protection: All user input sanitized
- CSRF Protection: Not applicable (stateless API)
- Content Security Headers: Set via Netlify
- Input Validation: Server-side validation on contact form
- Rate Limiting: Basic per-IP limiting on contact endpoint
- No sensitive data exposure: Phone numbers removed/redacted

## Troubleshooting

### Contact Form Not Working

- Ensure you're running via `netlify dev` (not simple HTTP server)
- Check browser console for errors
- Verify `backend/data/` directory exists and is writable

### Netlify Functions Not Found (404)

- Ensure `netlify.toml` is properly configured
- Verify functions are in `netlify/functions/` directory
- Check Netlify build logs for errors

### Theme/Language Not Persisting

- Check browser localStorage is enabled
- Clear browser cache and try again

### Media Not Loading

- Verify files exist in `frontend/media/projects/<slug>/`
- Check file paths match exactly (case-sensitive on Linux/Netlify)
- Ensure SVG placeholders are valid XML

## License

This project is for personal portfolio use. Feel free to fork and adapt for your own portfolio.

## Contact

- **Email**: connor.jbszz@gmail.com
- **LinkedIn**: [linkedin.com/in/connum925](https://linkedin.com/in/connum925)
- **GitHub**: [github.com/connum925](https://github.com/connum925)

---

Built with HTML5, CSS3, Vanilla JavaScript, and Bootstrap 5. Deployed on Netlify.

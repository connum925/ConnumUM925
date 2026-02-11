# Deployment Checklist for Netlify

## Pre-Deployment Steps

### 1. Update Resume Data
- [ ] Edit `resume_data.txt` with final information
- [ ] Verify no phone numbers are present
- [ ] Run `python backend/scripts/generate_content.py`
- [ ] Verify all JSON files generated in `backend/data/`

### 2. Add Real Project Media
- [ ] Replace placeholder images in `frontend/media/projects/sweet-style/`
- [ ] Replace placeholder images in `frontend/media/projects/fluvi-traffic/`
- [ ] Replace placeholder images in `frontend/media/projects/file-explorer/`
- [ ] Add real video to `frontend/media/projects/fluvi-traffic/demo.mp4` (keep under 10MB)
- [ ] Optimize all images (use WebP or compressed JPEG)

### 3. Test Locally
- [ ] Install Netlify CLI: `npm install -g netlify-cli`
- [ ] Run `netlify dev`
- [ ] Test all pages load correctly
- [ ] Test language switching (EN/ES)
- [ ] Test theme switching (light/dark)
- [ ] Test project filtering and search
- [ ] Test contact form submission
- [ ] Test on mobile viewport
- [ ] Test keyboard navigation
- [ ] Test with screen reader (optional but recommended)

### 4. Initialize Git Repository
```bash
git init
git add .
git commit -m "Initial commit: Complete portfolio website"
```

### 5. Create GitHub Repository
- [ ] Create new repository on GitHub
- [ ] Push local code to GitHub:
```bash
git remote add origin https://github.com/connum925/portfolio.git
git branch -M main
git push -u origin main
```

## Netlify Deployment

### Method 1: Connect Git Repository (Recommended)

1. **Login to Netlify**
   - [ ] Go to [https://app.netlify.com](https://app.netlify.com)
   - [ ] Sign in with GitHub

2. **Create New Site**
   - [ ] Click "New site from Git"
   - [ ] Choose GitHub
   - [ ] Select your portfolio repository

3. **Configure Build Settings**
   - [ ] Build command: `python backend/scripts/generate_content.py`
   - [ ] Publish directory: `frontend`
   - [ ] Functions directory: `netlify/functions`
   - [ ] Click "Deploy site"

4. **Wait for Deployment**
   - [ ] Monitor build logs for errors
   - [ ] Wait for "Site is live" message

5. **Test Deployed Site**
   - [ ] Visit the Netlify URL (e.g., `https://random-name-123.netlify.app`)
   - [ ] Test all functionality
   - [ ] Verify API endpoints work
   - [ ] Test contact form
   - [ ] Check all images load
   - [ ] Test on mobile

### Method 2: Manual Deploy with CLI

```bash
# Login
netlify login

# Initialize site
netlify init

# Build
python backend/scripts/generate_content.py

# Deploy
netlify deploy --prod
```

## Post-Deployment Configuration

### 1. Custom Domain (Optional)
- [ ] Go to Site Settings > Domain management
- [ ] Click "Add custom domain"
- [ ] Follow DNS configuration instructions
- [ ] Wait for DNS propagation (can take up to 48 hours)
- [ ] Enable HTTPS (automatic with Netlify)

### 2. Update Site Name
- [ ] Go to Site Settings > General > Site details
- [ ] Click "Change site name"
- [ ] Enter desired name (e.g., `connor-urbano-portfolio`)
- [ ] New URL: `https://connor-urbano-portfolio.netlify.app`

### 3. Enable Forms Notifications (Optional)
- [ ] Go to Site Settings > Forms
- [ ] Set up email notifications for form submissions
- [ ] Or use Zapier/webhooks integration

### 4. Performance Checks
- [ ] Run Lighthouse audit in Chrome DevTools
- [ ] Verify Performance score > 90
- [ ] Verify Accessibility score > 95
- [ ] Verify Best Practices score > 90
- [ ] Verify SEO score > 90

### 5. Security Headers
Headers are already configured in `netlify.toml`:
- [ ] Verify headers at [securityheaders.com](https://securityheaders.com)
- [ ] Check CSP, X-Frame-Options, etc.

## Continuous Deployment

Once connected to Git, Netlify will automatically:
- ✅ Build and deploy on every push to `main` branch
- ✅ Create deploy previews for pull requests
- ✅ Run build command
- ✅ Deploy to production

To update your site:
```bash
# Make changes locally
# Test with netlify dev
netlify dev

# Commit and push
git add .
git commit -m "Update: description of changes"
git push origin main

# Netlify automatically deploys!
```

## Resume PDF

To add a downloadable resume PDF:

1. **Create PDF**
   - [ ] Export resume as PDF (without phone number)
   - [ ] Save as `frontend/resume-connor-urbano.pdf`

2. **Update Download Link**
   - [ ] Edit `frontend/assets/js/main.js`
   - [ ] Find the download resume event listener
   - [ ] Change `href` from `#` to `/resume-connor-urbano.pdf`
   - [ ] Remove the `preventDefault()` and `alert()`

3. **Deploy**
   - [ ] Commit and push changes
   - [ ] Verify PDF downloads on deployed site

## Updating Content

### To Update Profile Information:
1. Edit `resume_data.txt`
2. Run `python backend/scripts/generate_content.py`
3. Commit and push: `git add . && git commit -m "Update profile" && git push`

### To Add New Projects:
1. Edit `backend/scripts/generate_content.py`
2. Add project to `generate_projects()` function
3. Add media files to `frontend/media/projects/<slug>/`
4. Regenerate data: `python backend/scripts/generate_content.py`
5. Commit and push

### To Update Translations:
1. Edit `frontend/assets/js/i18n.js`
2. Commit and push

## Monitoring

### Check Contact Form Submissions
Contact messages are stored in `backend/data/messages.jsonl`. To view them:

1. **Via Netlify CLI:**
```bash
netlify functions:invoke contact --method GET
```

2. **Manual Check:**
- Messages are append-only in JSONL format
- Each line is a JSON object with timestamp, name, email, subject, message

### Analytics (Optional)
- [ ] Add Google Analytics
- [ ] Add Netlify Analytics (paid feature)
- [ ] Add privacy-friendly analytics (e.g., Plausible, Fathom)

## Troubleshooting

### Build Fails
- Check Netlify build logs
- Verify Python version in `runtime.txt`
- Test locally with `python backend/scripts/generate_content.py`

### Functions Don't Work
- Verify functions are in `netlify/functions/`
- Check function logs in Netlify dashboard
- Test locally with `netlify dev`

### Images Don't Load
- Verify file paths are correct
- Check case sensitivity (Linux is case-sensitive)
- Ensure files are committed to Git

### Contact Form Fails
- Check browser console for errors
- Verify function logs in Netlify
- Test with simple payload first

## SEO Optimization (Post-Deployment)

- [ ] Submit sitemap to Google Search Console
- [ ] Submit to Bing Webmaster Tools
- [ ] Add meta description to `index.html`
- [ ] Add Open Graph tags for social sharing
- [ ] Add Twitter Card tags
- [ ] Create `robots.txt` if needed
- [ ] Add structured data (JSON-LD) for rich snippets

## Maintenance

### Monthly
- [ ] Check contact form submissions
- [ ] Update project information if needed
- [ ] Check for broken links
- [ ] Review analytics

### Quarterly
- [ ] Update resume data
- [ ] Add new projects
- [ ] Update certificates
- [ ] Refresh screenshots

---

## Quick Commands Reference

```bash
# Local development
netlify dev

# Manual deploy
netlify deploy --prod

# Check deployment status
netlify status

# Open site in browser
netlify open:site

# Open admin dashboard
netlify open:admin

# View logs
netlify logs

# Generate data
python backend/scripts/generate_content.py
```

---

Ready to deploy! Follow the checklist step by step for a smooth deployment.

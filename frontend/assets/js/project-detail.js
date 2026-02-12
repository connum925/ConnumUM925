/**
 * Project Detail Page Logic
 */

import i18n from './i18n.js';
import api from './api.js';
import theme from './theme.js';
import animations from './animations.js';

class ProjectDetailPage {
    constructor() {
        this.project = null;
        this.init();
    }

    async init() {
        // Set current year in footer
        document.getElementById('currentYear').textContent = new Date().getFullYear();

        // Get project slug from URL
        const urlParams = new URLSearchParams(window.location.search);
        const slug = urlParams.get('slug');

        if (!slug) {
            this.showNotFound();
            return;
        }

        await this.loadProject(slug);

        // Listen for language changes
        window.addEventListener('languageChanged', () => {
            if (this.project) {
                this.renderProject();
            }
        });
    }

    async loadProject(slug) {
        try {
            const projects = await api.fetchProjects();
            this.project = projects.find(p => p.slug === slug);

            if (!this.project) {
                this.showNotFound();
                return;
            }

            this.renderProject();

        } catch (error) {
            console.error('Error loading project:', error);
            this.showNotFound();
        }
    }

    renderProject() {
        const container = document.getElementById('projectDetailContent');

        container.innerHTML = '';

        // Header
        const header = document.createElement('div');
        header.className = 'project-detail-header reveal-fade';

        if (this.project.featured) {
            const badge = document.createElement('div');
            badge.className = 'featured-badge mb-3';
            badge.textContent = 'Featured Project';
            header.appendChild(badge);
        }

        const title = document.createElement('h1');
        title.className = 'project-detail-title';
        title.textContent = i18n.getBilingualContent(this.project.title);

        const summary = document.createElement('p');
        summary.className = 'project-detail-summary';
        summary.textContent = i18n.getBilingualContent(this.project.summary);

        header.appendChild(title);
        header.appendChild(summary);

        // Meta information
        const meta = document.createElement('div');
        meta.className = 'project-detail-meta';

        const timeline = document.createElement('div');
        timeline.innerHTML = `
            <h4 class="h6 mb-2">${i18n.translate('project.timeline')}</h4>
            <p class="text-muted"><i class="bi bi-calendar3"></i> ${this.formatDate(this.project.startDate)} - ${this.formatDate(this.project.endDate)}</p>
        `;

        meta.appendChild(timeline);
        header.appendChild(meta);

        // Technologies
        const techSection = document.createElement('div');
        techSection.className = 'mb-4';

        const techTitle = document.createElement('h4');
        techTitle.className = 'h6 mb-3';
        techTitle.textContent = i18n.translate('project.technologies');

        const techTags = document.createElement('div');
        techTags.className = 'tech-tags';
        this.project.technologies.forEach(tech => {
            const tag = document.createElement('span');
            tag.className = 'tech-tag';
            tag.textContent = tech;
            techTags.appendChild(tag);
        });

        techSection.appendChild(techTitle);
        techSection.appendChild(techTags);
        header.appendChild(techSection);

        // Project links
        if (this.project.links && (this.project.links.github || this.project.links.demo || this.project.links.caseStudy)) {
            const linksSection = document.createElement('div');
            linksSection.className = 'mb-4';

            const linksTitle = document.createElement('h4');
            linksTitle.className = 'h6 mb-3';
            linksTitle.textContent = i18n.translate('project.links');

            const linksDiv = document.createElement('div');
            linksDiv.className = 'd-flex flex-wrap gap-2';

            if (this.project.links.github) {
                const githubBtn = document.createElement('a');
                githubBtn.href = this.project.links.github;
                githubBtn.className = 'btn btn-outline-primary';
                githubBtn.target = '_blank';
                githubBtn.rel = 'noopener noreferrer';
                githubBtn.innerHTML = '<i class="bi bi-github me-2"></i>' + i18n.translate('projects.viewGithub');
                linksDiv.appendChild(githubBtn);
            }

            if (this.project.links.demo) {
                const demoBtn = document.createElement('a');
                demoBtn.href = this.project.links.demo;
                demoBtn.className = 'btn btn-outline-primary';
                demoBtn.target = '_blank';
                demoBtn.rel = 'noopener noreferrer';
                demoBtn.innerHTML = '<i class="bi bi-box-arrow-up-right me-2"></i>' + i18n.translate('projects.viewDemo');
                linksDiv.appendChild(demoBtn);
            }

            if (this.project.links.caseStudy) {
                const caseBtn = document.createElement('a');
                caseBtn.href = this.project.links.caseStudy;
                caseBtn.className = 'btn btn-outline-primary';
                caseBtn.target = '_blank';
                caseBtn.rel = 'noopener noreferrer';
                caseBtn.innerHTML = '<i class="bi bi-file-text me-2"></i>' + i18n.translate('projects.viewCase');
                linksDiv.appendChild(caseBtn);
            }

            linksSection.appendChild(linksTitle);
            linksSection.appendChild(linksDiv);
            header.appendChild(linksSection);
        }

        container.appendChild(header);

        // Description
        const descSection = document.createElement('div');
        descSection.className = 'reveal-fade';

        const descTitle = document.createElement('h2');
        descTitle.className = 'h4 mb-3';
        descTitle.textContent = i18n.translate('project.description');

        const descText = document.createElement('div');
        descText.className = 'project-detail-description';

        // Convert description text to formatted paragraphs and lists
        const description = i18n.getBilingualContent(this.project.description);
        const paragraphs = description.split('\n\n').filter(p => p.trim());

        paragraphs.forEach(paragraph => {
            const trimmed = paragraph.trim();

            // SECURITY: Check if it's a project structure block
            // Only process if it has both opening and closing tags to prevent injection
            if (trimmed.startsWith('[PROJECT_STRUCTURE]') && trimmed.endsWith('[/PROJECT_STRUCTURE]')) {
                // SECURITY: Extract content between tags safely
                const structureContent = trimmed.replace('[PROJECT_STRUCTURE]', '').replace('[/PROJECT_STRUCTURE]', '').trim();
                // SECURITY: createProjectStructure includes sanitization
                const structureDiv = this.createProjectStructure(structureContent);
                descText.appendChild(structureDiv);
            }
            // Check if paragraph contains bullet points
            else if (trimmed.includes('•') || trimmed.match(/^[-•*]\s/m)) {
                // Check if it starts with a title before the bullets
                const lines = trimmed.split('\n');
                let currentElement = null;

                lines.forEach(line => {
                    const trimmedLine = line.trim();

                    if (trimmedLine.startsWith('•') || trimmedLine.startsWith('-') || trimmedLine.startsWith('*')) {
                        // It's a bullet point
                        if (!currentElement || currentElement.tagName !== 'UL') {
                            currentElement = document.createElement('ul');
                            currentElement.className = 'project-feature-list';
                            descText.appendChild(currentElement);
                        }

                        const li = document.createElement('li');
                        // Remove the bullet character and split by colon to separate title from description
                        const content = trimmedLine.replace(/^[•\-*]\s+/, '');
                        const colonIndex = content.indexOf(':');

                        if (colonIndex > 0 && colonIndex < 100) {
                            // Has a title (before colon)
                            const title = content.substring(0, colonIndex);
                            const desc = content.substring(colonIndex + 1).trim();

                            const strong = document.createElement('strong');
                            strong.textContent = title + ': ';
                            li.appendChild(strong);
                            li.appendChild(document.createTextNode(desc));
                        } else {
                            // No title, just content
                            li.textContent = content;
                        }

                        currentElement.appendChild(li);
                    } else if (trimmedLine) {
                        // It's a regular line (possibly a section title)
                        currentElement = document.createElement('p');
                        currentElement.className = 'mb-2 fw-semibold';
                        currentElement.textContent = trimmedLine;
                        descText.appendChild(currentElement);
                    }
                });
            } else {
                // Regular paragraph
                const p = document.createElement('p');
                p.textContent = trimmed;
                descText.appendChild(p);
            }
        });

        descSection.appendChild(descTitle);
        descSection.appendChild(descText);
        container.appendChild(descSection);

        // Media section (carousel)
        if (this.project.media && this.project.media.length > 0) {
            const mediaSection = this.createMediaCarousel();
            container.appendChild(mediaSection);
        }

        // Observe new elements for animations
        animations.observeNewElements(container.querySelectorAll('.reveal-fade'));
    }

    createMediaCarousel() {
        const section = document.createElement('div');
        section.className = 'project-media-section reveal-fade';

        const title = document.createElement('h2');
        title.className = 'h4 mb-4';
        title.textContent = i18n.translate('project.media');

        const carouselId = 'projectMediaCarousel';

        const carousel = document.createElement('div');
        carousel.id = carouselId;
        carousel.className = 'carousel slide';
        carousel.setAttribute('data-bs-ride', 'carousel');

        // Indicators
        if (this.project.media.length > 1) {
            const indicators = document.createElement('div');
            indicators.className = 'carousel-indicators';

            this.project.media.forEach((_, index) => {
                const button = document.createElement('button');
                button.type = 'button';
                button.setAttribute('data-bs-target', `#${carouselId}`);
                button.setAttribute('data-bs-slide-to', index.toString());
                button.setAttribute('aria-label', `Slide ${index + 1}`);
                if (index === 0) {
                    button.className = 'active';
                    button.setAttribute('aria-current', 'true');
                }
                indicators.appendChild(button);
            });

            carousel.appendChild(indicators);
        }

        // Inner (slides)
        const inner = document.createElement('div');
        inner.className = 'carousel-inner';

        this.project.media.forEach((item, index) => {
            const slideDiv = document.createElement('div');
            slideDiv.className = index === 0 ? 'carousel-item active' : 'carousel-item';

            if (item.type === 'image') {
                const img = document.createElement('img');
                img.src = item.src;
                img.className = 'd-block w-100';
                img.alt = i18n.getBilingualContent(item.alt);
                // Force eager loading to avoid Edge lazy loading bug
                img.loading = 'eager';
                img.setAttribute('loading', 'eager');

                // Handle image load error
                img.onerror = () => {
                    console.error(`[Project Detail] Failed to load image: ${item.src}`);
                    img.style.display = 'none';
                    const placeholder = document.createElement('div');
                    placeholder.className = 'd-flex align-items-center justify-content-center bg-secondary';
                    placeholder.style.minHeight = '400px';
                    placeholder.innerHTML = `
                        <div class="text-center text-white">
                            <i class="bi bi-image" style="font-size: 3rem;"></i>
                            <p class="mt-3">Image not available</p>
                        </div>
                    `;
                    slideDiv.appendChild(placeholder);
                };

                img.onload = () => {
                    console.log(`[Project Detail] Image loaded successfully: ${item.src}`);
                };

                slideDiv.appendChild(img);
            } else if (item.type === 'youtube') {
                // YouTube video embed
                const embedContainer = document.createElement('div');
                embedContainer.className = 'ratio ratio-16x9';

                const iframe = document.createElement('iframe');
                // Extract video ID from URL if not provided
                const videoId = item.videoId || this.extractYouTubeId(item.src);
                iframe.src = `https://www.youtube.com/embed/${videoId}`;
                iframe.title = i18n.getBilingualContent(item.alt);
                iframe.setAttribute('frameborder', '0');
                iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
                iframe.setAttribute('allowfullscreen', '');
                iframe.loading = 'lazy';

                embedContainer.appendChild(iframe);
                slideDiv.appendChild(embedContainer);
            } else if (item.type === 'video') {
                const video = document.createElement('video');
                video.src = item.src;
                video.className = 'd-block w-100';
                video.controls = true;
                video.preload = 'metadata';
                video.setAttribute('aria-label', i18n.getBilingualContent(item.alt));
                slideDiv.appendChild(video);
            }

            // Caption
            if (item.caption) {
                const caption = document.createElement('div');
                caption.className = 'carousel-caption d-none d-md-block';
                const captionText = document.createElement('p');
                captionText.textContent = i18n.getBilingualContent(item.caption);
                caption.appendChild(captionText);
                slideDiv.appendChild(caption);
            }

            inner.appendChild(slideDiv);
        });

        carousel.appendChild(inner);

        // Controls
        if (this.project.media.length > 1) {
            const prevBtn = document.createElement('button');
            prevBtn.className = 'carousel-control-prev';
            prevBtn.type = 'button';
            prevBtn.setAttribute('data-bs-target', `#${carouselId}`);
            prevBtn.setAttribute('data-bs-slide', 'prev');
            prevBtn.innerHTML = `
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Previous</span>
            `;

            const nextBtn = document.createElement('button');
            nextBtn.className = 'carousel-control-next';
            nextBtn.type = 'button';
            nextBtn.setAttribute('data-bs-target', `#${carouselId}`);
            nextBtn.setAttribute('data-bs-slide', 'next');
            nextBtn.innerHTML = `
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Next</span>
            `;

            carousel.appendChild(prevBtn);
            carousel.appendChild(nextBtn);
        }

        section.appendChild(title);
        section.appendChild(carousel);

        return section;
    }

    showNotFound() {
        document.getElementById('projectDetailContent').classList.add('d-none');
        document.getElementById('projectNotFound').classList.remove('d-none');
    }

    extractYouTubeId(url) {
        // Extract YouTube video ID from various URL formats
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    }

    formatDate(dateString) {
        if (!dateString) return '';
        const [year, month] = dateString.split('-');
        const monthNames = {
            en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            es: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
        };
        const lang = i18n.getCurrentLanguage();
        return `${monthNames[lang][parseInt(month) - 1]} ${year}`;
    }

    createProjectStructure(content) {
        const container = document.createElement('div');
        container.className = 'project-structure-section mt-5';

        // SECURITY: Sanitize and validate input
        if (!content || typeof content !== 'string') {
            console.warn('Invalid project structure content');
            return container;
        }

        // SECURITY: Limit content size to prevent DoS
        const MAX_CONTENT_LENGTH = 10000;
        if (content.length > MAX_CONTENT_LENGTH) {
            console.warn('Project structure content too large');
            content = content.substring(0, MAX_CONTENT_LENGTH);
        }

        // Title (using createElement for security)
        const title = document.createElement('h3');
        title.className = 'project-structure-title';

        const icon = document.createElement('i');
        icon.className = 'bi bi-folder-fill me-2';
        title.appendChild(icon);

        const titleText = document.createTextNode(i18n.translate('project.structure'));
        title.appendChild(titleText);
        container.appendChild(title);

        // Terminal window
        const terminal = document.createElement('div');
        terminal.className = 'project-structure-terminal';

        // Terminal header (safe static content)
        const header = document.createElement('div');
        header.className = 'terminal-header';

        // Create dots safely
        ['red', 'yellow', 'green'].forEach(color => {
            const dot = document.createElement('span');
            dot.className = `terminal-dot terminal-dot-${color}`;
            header.appendChild(dot);
        });

        const headerTitle = document.createElement('span');
        headerTitle.className = 'terminal-title';
        headerTitle.textContent = 'project-structure';
        header.appendChild(headerTitle);

        terminal.appendChild(header);

        // Terminal body
        const body = document.createElement('div');
        body.className = 'terminal-body';

        // SECURITY: Parse and render structure with sanitization
        const lines = content.split('\n');
        const MAX_LINES = 200; // Prevent DoS with too many lines
        const pre = document.createElement('pre');
        const code = document.createElement('code');

        lines.slice(0, MAX_LINES).forEach(line => {
            // SECURITY: Sanitize each line
            const sanitizedLine = this.sanitizeStructureLine(line);

            const lineDiv = document.createElement('div');
            lineDiv.className = 'structure-line';

            // Check if line has a comment
            const commentMatch = sanitizedLine.match(/^(.+?)(#.+)$/);
            if (commentMatch) {
                const path = commentMatch[1];
                const comment = commentMatch[2];

                const pathSpan = document.createElement('span');
                pathSpan.className = 'structure-path';
                pathSpan.textContent = path; // SECURITY: textContent prevents XSS

                const commentSpan = document.createElement('span');
                commentSpan.className = 'structure-comment';
                commentSpan.textContent = comment; // SECURITY: textContent prevents XSS

                lineDiv.appendChild(pathSpan);
                lineDiv.appendChild(commentSpan);
            } else {
                // Just the structure line
                lineDiv.textContent = sanitizedLine; // SECURITY: textContent prevents XSS
            }

            code.appendChild(lineDiv);
        });

        pre.appendChild(code);
        body.appendChild(pre);
        terminal.appendChild(body);
        container.appendChild(terminal);

        return container;
    }

    sanitizeStructureLine(line) {
        // SECURITY: Remove any potentially dangerous characters
        if (!line || typeof line !== 'string') {
            return '';
        }

        // Remove null bytes
        line = line.replace(/\0/g, '');

        // Remove control characters except tab and newline
        line = line.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

        // Limit line length to prevent DoS
        const MAX_LINE_LENGTH = 500;
        if (line.length > MAX_LINE_LENGTH) {
            line = line.substring(0, MAX_LINE_LENGTH) + '...';
        }

        // Only allow safe characters for file structure:
        // alphanumeric, space, basic punctuation, tree characters
        const SAFE_PATTERN = /^[a-zA-Z0-9\s\-_.\/()#:├│└─├─ ]+$/;
        if (!SAFE_PATTERN.test(line)) {
            console.warn('Potentially unsafe characters detected in structure line');
            // Remove unsafe characters
            line = line.replace(/[^a-zA-Z0-9\s\-_.\/()#:├│└─├─ ]/g, '');
        }

        return line;
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new ProjectDetailPage());
} else {
    new ProjectDetailPage();
}

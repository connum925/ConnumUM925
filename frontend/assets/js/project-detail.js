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

        const descText = document.createElement('p');
        descText.className = 'project-detail-description';
        descText.textContent = i18n.getBilingualContent(this.project.description);

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
                img.loading = 'lazy';
                slideDiv.appendChild(img);
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
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new ProjectDetailPage());
} else {
    new ProjectDetailPage();
}

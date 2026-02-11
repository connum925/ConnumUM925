/**
 * About Gallery Module
 * Handles personal images gallery
 */

import i18n from './i18n.js';

class AboutGallery {
    constructor() {
        // Simple configuration - just define your images here
        // To add/remove images, edit this array
        this.images = [
            { src: '/assets/images/about/me1.jpeg', altKey: 'about.imageAlt1', captionKey: 'about.imageCaption1' },
            { src: '/assets/images/about/me2.jpeg', altKey: 'about.imageAlt2', captionKey: 'about.imageCaption2' },
            { src: '/assets/images/about/me3.jpeg', altKey: 'about.imageAlt3', captionKey: 'about.imageCaption3' }
        ];
    }

    init() {
        this.renderGallery();

        // Listen for language changes
        window.addEventListener('languageChanged', () => {
            this.renderGallery();
        });
    }

    renderGallery() {
        const container = document.getElementById('aboutImagesContainer');
        if (!container) return;

        container.innerHTML = '';

        this.images.forEach((imageInfo) => {
            const col = document.createElement('div');
            col.className = 'col-md-4 col-sm-6';

            const imageCard = document.createElement('div');
            imageCard.className = 'about-image-card reveal-fade revealed';

            // Create image wrapper
            const imgWrapper = document.createElement('div');
            imgWrapper.className = 'about-image-wrapper';

            // Create image element
            const img = document.createElement('img');
            img.src = imageInfo.src;
            img.alt = i18n.translate(imageInfo.altKey);
            img.className = 'about-image';
            img.width = 400;
            img.height = 400;

            // Handle image load error - show placeholder if image doesn't exist
            img.onerror = () => {
                imgWrapper.innerHTML = '';
                const placeholder = document.createElement('div');
                placeholder.className = 'about-image-placeholder';
                placeholder.setAttribute('aria-label', i18n.translate(imageInfo.altKey));
                placeholder.setAttribute('role', 'img');

                const icon = document.createElement('i');
                icon.className = 'bi bi-image';
                icon.setAttribute('aria-hidden', 'true');

                const text = document.createElement('p');
                text.textContent = i18n.translate('about.imagePlaceholder');

                placeholder.appendChild(icon);
                placeholder.appendChild(text);
                imgWrapper.appendChild(placeholder);
            };

            imgWrapper.appendChild(img);
            imageCard.appendChild(imgWrapper);

            // Add caption
            const caption = document.createElement('div');
            caption.className = 'about-image-caption';
            caption.textContent = i18n.translate(imageInfo.captionKey);
            imageCard.appendChild(caption);

            col.appendChild(imageCard);
            container.appendChild(col);
        });
    }
}

// Create and export singleton instance
const aboutGallery = new AboutGallery();
export default aboutGallery;

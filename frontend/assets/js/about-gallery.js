/**
 * About Gallery Module
 * Handles personal images gallery
 */

import i18n from './i18n.js';

class AboutGallery {
    constructor() {
        // Simple configuration - images and videos
        this.media = [
            { type: 'image', src: '/assets/images/about/me1.jpeg', altKey: 'about.imageAlt1', captionKey: 'about.imageCaption1' },
            { type: 'video', src: '/assets/images/about/video2.mp4', altKey: 'about.videoAlt2', captionKey: 'about.imageCaption2' },
            { type: 'image', src: '/assets/images/about/me3.jpeg', altKey: 'about.imageAlt3', captionKey: 'about.imageCaption3' },
            { type: 'video', src: '/assets/images/about/video1.mp4', altKey: 'about.videoAlt1', captionKey: 'about.videoCaption1' },
            { type: 'image', src: '/assets/images/about/me2.jpeg', altKey: 'about.imageAlt2', captionKey: 'about.videoCaption2' },
            { type: 'video', src: '/assets/images/about/video3.mp4', altKey: 'about.videoAlt3', captionKey: 'about.videoCaption3' }
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

        this.media.forEach((mediaInfo) => {
            const col = document.createElement('div');
            col.className = 'col-md-4 col-sm-6';

            const mediaCard = document.createElement('div');
            mediaCard.className = 'about-image-card reveal-fade revealed';

            if (mediaInfo.type === 'image') {
                // Create image wrapper
                const imgWrapper = document.createElement('div');
                imgWrapper.className = 'about-image-wrapper';

                // Create image element
                const img = document.createElement('img');
                img.src = mediaInfo.src;
                img.alt = i18n.translate(mediaInfo.altKey);
                img.className = 'about-image';
                img.width = 400;
                img.height = 400;

                // Handle image load error
                img.onerror = () => {
                    imgWrapper.innerHTML = '';
                    const placeholder = document.createElement('div');
                    placeholder.className = 'about-image-placeholder';
                    placeholder.setAttribute('aria-label', i18n.translate(mediaInfo.altKey));
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
                mediaCard.appendChild(imgWrapper);

            } else if (mediaInfo.type === 'video') {
                // Create video wrapper
                const videoWrapper = document.createElement('div');
                videoWrapper.className = 'about-video-wrapper';

                // Create video element
                const video = document.createElement('video');
                video.src = mediaInfo.src;
                video.className = 'about-video';
                video.autoplay = true;
                video.loop = true;
                video.muted = true; // No audio
                video.playsInline = true; // For mobile
                video.setAttribute('aria-label', i18n.translate(mediaInfo.altKey));

                // Handle video load error
                video.onerror = () => {
                    videoWrapper.innerHTML = '';
                    const placeholder = document.createElement('div');
                    placeholder.className = 'about-video-placeholder';
                    placeholder.setAttribute('aria-label', i18n.translate(mediaInfo.altKey));
                    placeholder.setAttribute('role', 'img');

                    const icon = document.createElement('i');
                    icon.className = 'bi bi-play-circle';
                    icon.setAttribute('aria-hidden', 'true');

                    const text = document.createElement('p');
                    text.textContent = 'Video not available';

                    placeholder.appendChild(icon);
                    placeholder.appendChild(text);
                    videoWrapper.appendChild(placeholder);
                };

                videoWrapper.appendChild(video);
                mediaCard.appendChild(videoWrapper);
            }

            // Add caption
            const caption = document.createElement('div');
            caption.className = 'about-image-caption';
            caption.textContent = i18n.translate(mediaInfo.captionKey);
            mediaCard.appendChild(caption);

            col.appendChild(mediaCard);
            container.appendChild(col);
        });
    }
}

// Create and export singleton instance
const aboutGallery = new AboutGallery();
export default aboutGallery;

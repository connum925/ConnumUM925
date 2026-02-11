/**
 * Theme Module
 * Handles light/dark mode theme switching
 */

class Theme {
    constructor() {
        this.currentTheme = this.getSavedTheme();
        this.init();
    }

    getSavedTheme() {
        const saved = localStorage.getItem('theme');
        if (saved) return saved;

        // Check system preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }

        return 'light';
    }

    setTheme(theme) {
        this.currentTheme = theme;
        localStorage.setItem('theme', theme);
        document.documentElement.setAttribute('data-theme', theme);
        this.updateThemeIcon();

        // Dispatch event for other modules
        window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));
    }

    updateThemeIcon() {
        const icon = document.getElementById('themeIcon');
        if (icon) {
            if (this.currentTheme === 'dark') {
                icon.classList.remove('bi-sun-fill');
                icon.classList.add('bi-moon-fill');
            } else {
                icon.classList.remove('bi-moon-fill');
                icon.classList.add('bi-sun-fill');
            }
        }
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }

    init() {
        // Set initial theme
        this.setTheme(this.currentTheme);

        // Setup theme toggle button
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // Listen for system theme changes
        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                if (!localStorage.getItem('theme')) {
                    this.setTheme(e.matches ? 'dark' : 'light');
                }
            });
        }
    }
}

// Create and export singleton instance
const theme = new Theme();
export default theme;

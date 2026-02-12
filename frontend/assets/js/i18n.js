/**
 * Internationalization (i18n) Module
 * Handles language switching between English and Spanish
 */

const translations = {
    en: {
        nav: {
            about: "About",
            skills: "Skills",
            experience: "Experience",
            education: "Education",
            projects: "Projects",
            contact: "Contact"
        },
        hero: {
            viewProjects: "View Projects",
            contact: "Get in Touch",
            downloadResume: "Download Resume"
        },
        about: {
            title: "About Me",
            galleryTitle: "A Glimpse Into Me",
            imageAlt1: "Personal photo 1",
            imageAlt2: "Personal photo 2",
            imageAlt3: "Personal photo 3",
            imageCaption1: "Exploring new technologies",
            imageCaption2: "In my element",
            imageCaption3: "Always learning",
            videoAlt1: "Personal video 1",
            videoAlt2: "Personal video 2",
            videoAlt3: "Personal video 3",
            videoCaption1: "In action",
            videoCaption2: "My journey",
            videoCaption3: "At work",
            imagePlaceholder: "Image not provided"
        },
        skills: {
            title: "Technical Skills"
        },
        experience: {
            title: "Professional Experience",
            current: "Present",
            achievements: "Key Achievements"
        },
        education: {
            title: "Education",
            gpa: "GPA",
            coursework: "Relevant Coursework"
        },
        certificates: {
            title: "Certifications",
            viewCredential: "View Credential"
        },
        projects: {
            title: "Projects",
            searchLabel: "Search Projects",
            searchPlaceholder: "Search by name, description, or technology...",
            filterLabel: "Filter by Technology",
            allTech: "All Technologies",
            clearFilters: "Clear Filters",
            noResults: "No projects match your search criteria.",
            viewDetails: "View Details",
            viewDemo: "Live Demo",
            viewGithub: "View Code",
            viewCase: "Case Study"
        },
        contact: {
            title: "Get In Touch",
            subtitle: "Let's connect! Feel free to reach out through any of these channels.",
            email: "Email",
            emailDesc: "Best for professional inquiries",
            linkedinDesc: "Connect and view my professional profile",
            githubDesc: "Explore my code and repositories"
        },
        project: {
            back: "Back to Projects",
            loading: "Loading project details...",
            notFound: "Project Not Found",
            notFoundDesc: "The requested project could not be found.",
            backToProjects: "View All Projects",
            technologies: "Technologies Used",
            timeline: "Project Timeline",
            links: "Project Links",
            media: "Project Media",
            description: "Description",
            structure: "Project Architecture"
        },
        footer: {
            rights: "All rights reserved.",
            built: "Built with HTML5, CSS3, Vanilla JavaScript, and Bootstrap 5",
            viewMore: "View More"
        }
    },
    es: {
        nav: {
            about: "Acerca de",
            skills: "Habilidades",
            experience: "Experiencia",
            education: "Educación",
            projects: "Proyectos",
            contact: "Contacto"
        },
        hero: {
            viewProjects: "Ver Proyectos",
            contact: "Contactar",
            downloadResume: "Descargar CV"
        },
        about: {
            title: "Acerca de Mí",
            galleryTitle: "Un Vistazo de Mi",
            imageAlt1: "Foto personal 1",
            imageAlt2: "Foto personal 2",
            imageAlt3: "Foto personal 3",
            imageCaption1: "Explorando nuevas tecnologías",
            imageCaption2: "En mi elemento",
            imageCaption3: "Siempre aprendiendo",
            videoAlt1: "Video personal 1",
            videoAlt2: "Video personal 2",
            videoAlt3: "Video personal 3",
            videoCaption1: "En acción",
            videoCaption2: "Mi trayectoria",
            videoCaption3: "En el trabajo",
            imagePlaceholder: "Imagen no disponible"
        },
        skills: {
            title: "Habilidades Técnicas"
        },
        experience: {
            title: "Experiencia Profesional",
            current: "Actual",
            achievements: "Logros Clave"
        },
        education: {
            title: "Educación",
            gpa: "Promedio",
            coursework: "Cursos Relevantes"
        },
        certificates: {
            title: "Certificaciones",
            viewCredential: "Ver Credencial"
        },
        projects: {
            title: "Proyectos",
            searchLabel: "Buscar Proyectos",
            searchPlaceholder: "Buscar por nombre, descripción o tecnología...",
            filterLabel: "Filtrar por Tecnología",
            allTech: "Todas las Tecnologías",
            clearFilters: "Limpiar Filtros",
            noResults: "No hay proyectos que coincidan con tus criterios de búsqueda.",
            viewDetails: "Ver Detalles",
            viewDemo: "Ver Demo",
            viewGithub: "Ver Código",
            viewCase: "Caso de Estudio"
        },
        contact: {
            title: "Contáctame",
            subtitle: "¡Conectemos! No dudes en contactarme a través de cualquiera de estos canales.",
            email: "Correo Electrónico",
            emailDesc: "Ideal para consultas profesionales",
            linkedinDesc: "Conéctate y ve mi perfil profesional",
            githubDesc: "Explora mi código y repositorios"
        },
        project: {
            back: "Volver a Proyectos",
            loading: "Cargando detalles del proyecto...",
            notFound: "Proyecto No Encontrado",
            notFoundDesc: "El proyecto solicitado no pudo ser encontrado.",
            backToProjects: "Ver Todos los Proyectos",
            technologies: "Tecnologías Utilizadas",
            timeline: "Línea de Tiempo del Proyecto",
            links: "Enlaces del Proyecto",
            media: "Medios del Proyecto",
            description: "Descripción",
            structure: "Arquitectura del Proyecto"
        },
        footer: {
            rights: "Todos los derechos reservados.",
            built: "Construido con HTML5, CSS3, JavaScript Vanilla y Bootstrap 5",
            viewMore: "Ver Más"
        }
    }
};

class I18n {
    constructor() {
        this.currentLang = this.getSavedLanguage();
        this.init();
    }

    getSavedLanguage() {
        return localStorage.getItem('language') || 'en';
    }

    setLanguage(lang) {
        this.currentLang = lang;
        localStorage.setItem('language', lang);
        this.updatePageLanguage();
        this.updateLangToggle();
        // Dispatch event for other modules to listen to
        window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
    }

    getCurrentLanguage() {
        return this.currentLang;
    }

    translate(key, lang = this.currentLang) {
        const keys = key.split('.');
        let value = translations[lang];

        for (const k of keys) {
            if (value && typeof value === 'object') {
                value = value[k];
            } else {
                return key; // Return key if translation not found
            }
        }

        return value || key;
    }

    // Get bilingual content (for API data)
    getBilingualContent(content) {
        if (typeof content === 'object' && content !== null) {
            return content[this.currentLang] || content.en || '';
        }
        return content;
    }

    updatePageLanguage() {
        document.documentElement.lang = this.currentLang;

        // Update all elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            element.textContent = this.translate(key);
        });

        // Update all elements with data-i18n-placeholder attribute
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            element.placeholder = this.translate(key);
        });

        // Update all elements with data-i18n-title attribute
        document.querySelectorAll('[data-i18n-title]').forEach(element => {
            const key = element.getAttribute('data-i18n-title');
            element.title = this.translate(key);
        });

        // Update all elements with data-i18n-aria-label attribute
        document.querySelectorAll('[data-i18n-aria-label]').forEach(element => {
            const key = element.getAttribute('data-i18n-aria-label');
            element.setAttribute('aria-label', this.translate(key));
        });
    }

    updateLangToggle() {
        const langText = document.getElementById('langText');
        if (langText) {
            langText.textContent = this.currentLang.toUpperCase();
        }
    }

    toggleLanguage() {
        const newLang = this.currentLang === 'en' ? 'es' : 'en';
        this.setLanguage(newLang);
    }

    init() {
        // Set initial language
        this.setLanguage(this.currentLang);

        // Setup language toggle button
        const langToggle = document.getElementById('langToggle');
        if (langToggle) {
            langToggle.addEventListener('click', () => this.toggleLanguage());
        }
    }
}

// Create and export singleton instance
const i18n = new I18n();
export default i18n;

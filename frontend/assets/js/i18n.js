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
            galleryTitle: "A Glimpse Into My World",
            imageAlt1: "Personal photo 1",
            imageAlt2: "Personal photo 2",
            imageAlt3: "Personal photo 3",
            imageCaption1: "Exploring new technologies",
            imageCaption2: "In my element",
            imageCaption3: "Always learning",
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
            infoTitle: "Contact Information",
            email: "Email",
            form: {
                name: "Name",
                namePlaceholder: "Your name",
                nameError: "Please enter your name (at least 2 characters).",
                email: "Email",
                emailPlaceholder: "your.email@example.com",
                emailError: "Please enter a valid email address.",
                subject: "Subject",
                subjectPlaceholder: "What is this regarding?",
                subjectError: "Please enter a subject (at least 3 characters).",
                message: "Message",
                messagePlaceholder: "Your message...",
                messageError: "Please enter a message (at least 10 characters).",
                submit: "Send Message",
                submitting: "Sending...",
                success: "Thank you for your message! I will get back to you soon.",
                error: "There was an error sending your message. Please try again or email me directly."
            }
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
            description: "Description"
        },
        footer: {
            rights: "All rights reserved.",
            built: "Built with HTML5, CSS3, Vanilla JavaScript, and Bootstrap 5"
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
            galleryTitle: "Un Vistazo a Mi Mundo",
            imageAlt1: "Foto personal 1",
            imageAlt2: "Foto personal 2",
            imageAlt3: "Foto personal 3",
            imageCaption1: "Explorando nuevas tecnologías",
            imageCaption2: "En mi elemento",
            imageCaption3: "Siempre aprendiendo",
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
            infoTitle: "Información de Contacto",
            email: "Correo Electrónico",
            form: {
                name: "Nombre",
                namePlaceholder: "Tu nombre",
                nameError: "Por favor ingresa tu nombre (al menos 2 caracteres).",
                email: "Correo Electrónico",
                emailPlaceholder: "tu.correo@ejemplo.com",
                emailError: "Por favor ingresa un correo electrónico válido.",
                subject: "Asunto",
                subjectPlaceholder: "¿De qué se trata?",
                subjectError: "Por favor ingresa un asunto (al menos 3 caracteres).",
                message: "Mensaje",
                messagePlaceholder: "Tu mensaje...",
                messageError: "Por favor ingresa un mensaje (al menos 10 caracteres).",
                submit: "Enviar Mensaje",
                submitting: "Enviando...",
                success: "¡Gracias por tu mensaje! Me pondré en contacto contigo pronto.",
                error: "Hubo un error al enviar tu mensaje. Por favor intenta nuevamente o contáctame directamente por correo."
            }
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
            description: "Descripción"
        },
        footer: {
            rights: "Todos los derechos reservados.",
            built: "Construido con HTML5, CSS3, JavaScript Vanilla y Bootstrap 5"
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

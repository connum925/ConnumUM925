/**
 * Main Application Logic
 */

import i18n from './i18n.js';
import api from './api.js';
import theme from './theme.js';
import animations from './animations.js';
import aboutGallery from './about-gallery.js';

class PortfolioApp {
    constructor() {
        this.allProjects = [];
        this.filteredProjects = [];
        this.profileData = null;
        this.experienceData = null;
        this.educationData = null;
        this.skillsData = null;
        this.certificatesData = null;
        this.init();
    }

    async init() {
        // Set current year in footer
        document.getElementById('currentYear').textContent = new Date().getFullYear();

        // Load all data
        await this.loadAllData();

        // Initialize about gallery (no longer async)
        aboutGallery.init();

        // Setup event listeners
        this.setupEventListeners();

        // Setup smooth scroll
        this.setupSmoothScroll();
    }

    async loadAllData() {
        try {
            await Promise.all([
                this.loadProfile(),
                this.loadSkills(),
                this.loadExperience(),
                this.loadEducation(),
                this.loadCertificates(),
                this.loadProjects()
            ]);
        } catch (error) {
            console.error('Error loading data:', error);
        }
    }

    async loadProfile() {
        try {
            this.profileData = await api.fetchProfile();
            const profile = this.profileData;

            // Update hero section
            document.getElementById('heroName').textContent = profile.name;
            document.getElementById('heroTitle').textContent = i18n.getBilingualContent(profile.title);
            document.getElementById('heroSummary').textContent = i18n.getBilingualContent(profile.summary);

            // Update about section
            document.getElementById('aboutSummary').textContent = i18n.getBilingualContent(profile.summary);

            // Update contact links in hero
            const email = profile.contact.email;
            const linkedin = profile.contact.linkedin;
            const github = profile.contact.github;

            document.getElementById('emailLink').href = `mailto:${email}`;
            document.getElementById('linkedinLink').href = `https://${linkedin}`;
            document.getElementById('githubLink').href = `https://${github}`;

            // Update contact section
            document.getElementById('contactEmail').textContent = email;
            document.getElementById('contactEmail').href = `mailto:${email}`;
            document.getElementById('contactLinkedin').textContent = linkedin;
            document.getElementById('contactLinkedin').href = `https://${linkedin}`;
            document.getElementById('contactGithub').textContent = github;
            document.getElementById('contactGithub').href = `https://${github}`;

            // Update download resume link (placeholder)
            document.getElementById('downloadResume').href = '#';
            document.getElementById('downloadResume').addEventListener('click', (e) => {
                e.preventDefault();
                alert('Resume PDF download would be implemented here. Please contact me directly for a copy.');
            });

        } catch (error) {
            console.error('Error loading profile:', error);
        }
    }

    async loadSkills() {
        try {
            this.skillsData = await api.fetchSkills();
            const skills = this.skillsData;
            const container = document.getElementById('skillsContent');

            const renderSkillCategory = (key, data) => {
                const col = document.createElement('div');
                col.className = 'col-lg-6 col-md-12 reveal-fade';

                const categoryDiv = document.createElement('div');
                categoryDiv.className = 'skill-category';

                const title = document.createElement('h3');
                title.className = 'skill-category-title';
                title.textContent = i18n.getBilingualContent(data.label);

                const tagsDiv = document.createElement('div');
                tagsDiv.className = 'skill-tags';

                // Handle different skill data structures
                if (key === 'languages') {
                    // Languages have proficient and familiar
                    data.proficient.forEach(skill => {
                        const tag = document.createElement('span');
                        tag.className = 'skill-tag';
                        tag.textContent = skill;
                        tagsDiv.appendChild(tag);
                    });
                    data.familiar.forEach(skill => {
                        const tag = document.createElement('span');
                        tag.className = 'skill-tag';
                        tag.textContent = skill;
                        tag.style.opacity = '0.7';
                        tagsDiv.appendChild(tag);
                    });
                } else if (key === 'ai_ml') {
                    // AI/ML has nested categories
                    data.items.forEach(item => {
                        item.technologies.forEach(tech => {
                            const tag = document.createElement('span');
                            tag.className = 'skill-tag';
                            tag.textContent = tech;
                            tagsDiv.appendChild(tag);
                        });
                    });
                } else if (key === 'data_engineering') {
                    // Data Engineering skills are bilingual objects
                    data.items.forEach(skill => {
                        const tag = document.createElement('span');
                        tag.className = 'skill-tag';
                        tag.textContent = i18n.getBilingualContent(skill);
                        tagsDiv.appendChild(tag);
                    });
                } else if (key === 'interpersonal') {
                    // Interpersonal skills are bilingual objects
                    data.items.forEach(skill => {
                        const tag = document.createElement('span');
                        tag.className = 'skill-tag';
                        tag.textContent = i18n.getBilingualContent(skill);
                        tagsDiv.appendChild(tag);
                    });
                } else {
                    // Others have simple items array
                    data.items.forEach(skill => {
                        const tag = document.createElement('span');
                        tag.className = 'skill-tag';
                        tag.textContent = skill;
                        tagsDiv.appendChild(tag);
                    });
                }

                categoryDiv.appendChild(title);
                categoryDiv.appendChild(tagsDiv);
                col.appendChild(categoryDiv);
                container.appendChild(col);
            };

            // Render all skill categories
            renderSkillCategory('languages', skills.languages);
            renderSkillCategory('frameworks', skills.frameworks);
            renderSkillCategory('tools', skills.tools);
            renderSkillCategory('ai_ml', skills.ai_ml);
            renderSkillCategory('data_engineering', skills.data_engineering);
            renderSkillCategory('interpersonal', skills.interpersonal);

            // Observe new elements for animations
            animations.observeNewElements(container.querySelectorAll('.reveal-fade'));

        } catch (error) {
            console.error('Error loading skills:', error);
        }
    }

    async loadExperience() {
        try {
            this.experienceData = await api.fetchExperience();
            const experiences = this.experienceData;
            const container = document.getElementById('experienceContent');

            experiences.forEach(exp => {
                const col = document.createElement('div');
                col.className = 'col-12 reveal-fade';

                const card = document.createElement('div');
                card.className = 'experience-card';

                // Header
                const header = document.createElement('div');
                header.className = 'experience-header';

                const title = document.createElement('h3');
                title.className = 'experience-title';
                title.textContent = i18n.getBilingualContent(exp.position);

                const company = document.createElement('div');
                company.className = 'experience-company';
                company.textContent = exp.company;

                const meta = document.createElement('div');
                meta.className = 'experience-meta';

                const dates = document.createElement('div');
                dates.className = 'meta-item';
                dates.innerHTML = `<i class="bi bi-calendar3"></i> <span>${this.formatDate(exp.startDate)} - ${exp.current ? i18n.translate('experience.current') : this.formatDate(exp.endDate)}</span>`;

                const location = document.createElement('div');
                location.className = 'meta-item';
                location.innerHTML = `<i class="bi bi-geo-alt"></i> <span>${i18n.getBilingualContent(exp.location)}</span>`;

                meta.appendChild(dates);
                meta.appendChild(location);

                header.appendChild(title);
                header.appendChild(company);
                header.appendChild(meta);

                // Achievements
                const achievements = document.createElement('div');
                achievements.className = 'experience-achievements';

                const achievementsTitle = document.createElement('h4');
                achievementsTitle.className = 'h6 mb-3';
                achievementsTitle.textContent = i18n.translate('experience.achievements');

                const list = document.createElement('ul');
                exp.achievements.forEach(achievement => {
                    const li = document.createElement('li');
                    li.textContent = i18n.getBilingualContent(achievement);
                    list.appendChild(li);
                });

                achievements.appendChild(achievementsTitle);
                achievements.appendChild(list);

                // Technologies
                const techTags = document.createElement('div');
                techTags.className = 'tech-tags';
                exp.technologies.forEach(tech => {
                    const tag = document.createElement('span');
                    tag.className = 'tech-tag';
                    tag.textContent = tech;
                    techTags.appendChild(tag);
                });

                card.appendChild(header);
                card.appendChild(achievements);
                card.appendChild(techTags);
                col.appendChild(card);
                container.appendChild(col);
            });

            // Observe new elements for animations
            animations.observeNewElements(container.querySelectorAll('.reveal-fade'));

        } catch (error) {
            console.error('Error loading experience:', error);
        }
    }

    async loadEducation() {
        try {
            this.educationData = await api.fetchEducation();
            const education = this.educationData;
            const container = document.getElementById('educationContent');

            education.forEach(edu => {
                const col = document.createElement('div');
                col.className = 'col-12 reveal-fade';

                const card = document.createElement('div');
                card.className = 'education-card';

                const header = document.createElement('div');
                header.className = 'education-header';

                const degree = document.createElement('h3');
                degree.className = 'education-degree';
                degree.textContent = i18n.getBilingualContent(edu.degree);

                const institution = document.createElement('div');
                institution.className = 'education-institution';
                institution.textContent = `${edu.institution} - ${edu.school}`;

                const meta = document.createElement('div');
                meta.className = 'education-meta';

                const dates = document.createElement('div');
                dates.className = 'meta-item';
                dates.innerHTML = `<i class="bi bi-calendar3"></i> <span>${this.formatDate(edu.startDate)} - ${this.formatDate(edu.endDate)}</span>`;

                const location = document.createElement('div');
                location.className = 'meta-item';
                location.innerHTML = `<i class="bi bi-geo-alt"></i> <span>${i18n.getBilingualContent(edu.location)}</span>`;

                const gpa = document.createElement('div');
                gpa.className = 'meta-item';
                gpa.innerHTML = `<i class="bi bi-award"></i> <span>${i18n.translate('education.gpa')}: ${i18n.getBilingualContent(edu.gpa)}</span>`;

                meta.appendChild(dates);
                meta.appendChild(location);
                meta.appendChild(gpa);

                header.appendChild(degree);
                header.appendChild(institution);
                if (edu.certificate) {
                    const cert = document.createElement('div');
                    cert.className = 'text-muted mt-2';
                    cert.textContent = i18n.getBilingualContent(edu.certificate);
                    header.appendChild(cert);
                }
                header.appendChild(meta);

                // Coursework
                if (edu.coursework) {
                    const coursework = document.createElement('div');
                    coursework.className = 'education-coursework mt-3';

                    const courseworkTitle = document.createElement('h4');
                    courseworkTitle.className = 'h6 mb-2';
                    courseworkTitle.textContent = i18n.translate('education.coursework');

                    const list = document.createElement('ul');
                    list.className = 'row';
                    const courses = i18n.getBilingualContent(edu.coursework);
                    courses.forEach(course => {
                        const li = document.createElement('li');
                        li.className = 'col-md-6';
                        li.textContent = course;
                        list.appendChild(li);
                    });

                    coursework.appendChild(courseworkTitle);
                    coursework.appendChild(list);
                    card.appendChild(header);
                    card.appendChild(coursework);
                } else {
                    card.appendChild(header);
                }

                col.appendChild(card);
                container.appendChild(col);
            });

            // Observe new elements for animations
            animations.observeNewElements(container.querySelectorAll('.reveal-fade'));

        } catch (error) {
            console.error('Error loading education:', error);
        }
    }

    async loadCertificates() {
        try {
            this.certificatesData = await api.fetchCertificates();
            const certificates = this.certificatesData;
            const container = document.getElementById('certificatesContent');

            certificates.forEach(cert => {
                const col = document.createElement('div');
                col.className = 'col-md-6 col-lg-4 reveal-fade';

                const card = document.createElement('div');
                card.className = 'certificate-card';

                // If certificate has URL, make it clickable
                if (cert.credentialUrl) {
                    card.style.cursor = 'pointer';
                    card.addEventListener('click', () => {
                        window.open(cert.credentialUrl, '_blank', 'noopener,noreferrer');
                    });
                    card.setAttribute('role', 'link');
                    card.setAttribute('tabindex', '0');
                    card.addEventListener('keypress', (e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            window.open(cert.credentialUrl, '_blank', 'noopener,noreferrer');
                        }
                    });
                }

                const title = document.createElement('h3');
                title.className = 'certificate-title';
                title.textContent = i18n.getBilingualContent(cert.title);

                const issuer = document.createElement('div');
                issuer.className = 'certificate-issuer';
                issuer.textContent = cert.issuer;

                const date = document.createElement('div');
                date.className = 'certificate-date';
                date.innerHTML = `<i class="bi bi-calendar3"></i> ${this.formatDate(cert.date)}`;

                card.appendChild(title);
                card.appendChild(issuer);
                card.appendChild(date);

                // Add credential link indicator if URL exists
                if (cert.credentialUrl) {
                    const linkIndicator = document.createElement('div');
                    linkIndicator.className = 'certificate-link-indicator mt-2';
                    linkIndicator.innerHTML = '<i class="bi bi-box-arrow-up-right"></i> <span data-i18n="certificates.viewCredential">View Credential</span>';
                    card.appendChild(linkIndicator);
                }

                col.appendChild(card);
                container.appendChild(col);
            });

            // Observe new elements for animations
            animations.observeNewElements(container.querySelectorAll('.reveal-fade'));

        } catch (error) {
            console.error('Error loading certificates:', error);
        }
    }

    async loadProjects() {
        try {
            this.allProjects = await api.fetchProjects();
            this.filteredProjects = [...this.allProjects];

            // Populate technology filter
            this.populateTechFilter();

            // Render projects
            this.renderProjects();

        } catch (error) {
            console.error('Error loading projects:', error);
        }
    }

    populateTechFilter() {
        const techFilter = document.getElementById('techFilter');
        const allTechs = new Set();

        this.allProjects.forEach(project => {
            project.technologies.forEach(tech => allTechs.add(tech));
        });

        const sortedTechs = Array.from(allTechs).sort();

        sortedTechs.forEach(tech => {
            const option = document.createElement('option');
            option.value = tech;
            option.textContent = tech;
            techFilter.appendChild(option);
        });
    }

    renderProjects() {
        const container = document.getElementById('projectsGrid');
        const noResults = document.getElementById('noProjectsMessage');

        container.innerHTML = '';

        if (this.filteredProjects.length === 0) {
            noResults.classList.remove('d-none');
            return;
        }

        noResults.classList.add('d-none');

        this.filteredProjects.forEach(project => {
            const col = document.createElement('div');
            col.className = 'col-md-6 col-lg-4 reveal-fade';

            const card = document.createElement('div');
            card.className = 'project-card';

            const body = document.createElement('div');
            body.className = 'project-card-body';

            if (project.featured) {
                const badge = document.createElement('div');
                badge.className = 'featured-badge';
                badge.textContent = 'Featured';
                body.appendChild(badge);
            }

            const title = document.createElement('h3');
            title.className = 'project-title';
            title.textContent = i18n.getBilingualContent(project.title);

            const summary = document.createElement('p');
            summary.className = 'project-summary';
            summary.textContent = i18n.getBilingualContent(project.summary);

            const techDiv = document.createElement('div');
            techDiv.className = 'project-tech';
            project.technologies.slice(0, 5).forEach(tech => {
                const tag = document.createElement('span');
                tag.className = 'project-tech-tag';
                tag.textContent = tech;
                techDiv.appendChild(tag);
            });

            const links = document.createElement('div');
            links.className = 'project-links';

            const detailBtn = document.createElement('a');
            detailBtn.href = `/project.html?slug=${project.slug}`;
            detailBtn.className = 'btn btn-primary btn-sm project-link-btn';
            detailBtn.textContent = i18n.translate('projects.viewDetails');
            links.appendChild(detailBtn);

            body.appendChild(title);
            body.appendChild(summary);
            body.appendChild(techDiv);
            body.appendChild(links);

            card.appendChild(body);
            col.appendChild(card);
            container.appendChild(col);
        });

        // Observe new elements for animations
        animations.observeNewElements(container.querySelectorAll('.reveal-fade'));
    }

    setupEventListeners() {
        // Project search
        const searchInput = document.getElementById('projectSearch');
        if (searchInput) {
            searchInput.addEventListener('input', () => this.filterProjects());
        }

        // Technology filter
        const techFilter = document.getElementById('techFilter');
        if (techFilter) {
            techFilter.addEventListener('change', () => this.filterProjects());
        }

        // Clear filters button
        const clearBtn = document.getElementById('clearFilters');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                searchInput.value = '';
                techFilter.value = '';
                this.filterProjects();
            });
        }

        // Contact form
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => this.handleContactSubmit(e));
        }

        // Listen for language changes to update content
        window.addEventListener('languageChanged', () => {
            this.updateDynamicContent();
        });
    }

    filterProjects() {
        const searchTerm = document.getElementById('projectSearch').value.toLowerCase();
        const selectedTech = document.getElementById('techFilter').value;

        this.filteredProjects = this.allProjects.filter(project => {
            const matchesSearch = !searchTerm ||
                i18n.getBilingualContent(project.title).toLowerCase().includes(searchTerm) ||
                i18n.getBilingualContent(project.summary).toLowerCase().includes(searchTerm) ||
                i18n.getBilingualContent(project.description).toLowerCase().includes(searchTerm) ||
                project.technologies.some(tech => tech.toLowerCase().includes(searchTerm));

            const matchesTech = !selectedTech || project.technologies.includes(selectedTech);

            return matchesSearch && matchesTech;
        });

        this.renderProjects();
    }

    async handleContactSubmit(e) {
        e.preventDefault();

        const form = e.target;
        const submitBtn = document.getElementById('submitContactForm');
        const submitText = submitBtn.querySelector('.submit-text');
        const submitSpinner = submitBtn.querySelector('.submit-spinner');
        const messageDiv = document.getElementById('contactFormMessage');

        // Client-side validation
        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            return;
        }

        const formData = {
            name: document.getElementById('contactName').value,
            email: document.getElementById('contactEmailInput').value,
            subject: document.getElementById('contactSubject').value,
            message: document.getElementById('contactMessage').value
        };

        // Disable button and show spinner
        submitBtn.disabled = true;
        submitText.textContent = i18n.translate('contact.form.submitting');
        submitSpinner.classList.remove('d-none');

        try {
            await api.submitContactForm(formData);

            // Success
            messageDiv.innerHTML = `<div class="alert alert-success">${i18n.translate('contact.form.success')}</div>`;
            form.reset();
            form.classList.remove('was-validated');

        } catch (error) {
            // Error
            const errorMessage = error.message || i18n.translate('contact.form.error');
            messageDiv.innerHTML = `<div class="alert alert-danger">${errorMessage}</div>`;

        } finally {
            // Re-enable button
            submitBtn.disabled = false;
            submitText.textContent = i18n.translate('contact.form.submit');
            submitSpinner.classList.add('d-none');

            // Clear message after 5 seconds
            setTimeout(() => {
                messageDiv.innerHTML = '';
            }, 5000);
        }
    }

    updateDynamicContent() {
        // Re-render ALL dynamic content with new language

        // Update hero and about sections (these use bilingual API data)
        this.updateProfileContent();

        // Re-render all sections
        this.updateSkillsContent();
        this.updateExperienceContent();
        this.updateEducationContent();
        this.updateCertificatesContent();
        this.renderProjects();
    }

    updateProfileContent() {
        // This data is already loaded, just update the displayed text
        const heroTitle = document.getElementById('heroTitle');
        const heroSummary = document.getElementById('heroSummary');
        const aboutSummary = document.getElementById('aboutSummary');

        if (this.profileData) {
            if (heroTitle) heroTitle.textContent = i18n.getBilingualContent(this.profileData.title);
            if (heroSummary) heroSummary.textContent = i18n.getBilingualContent(this.profileData.summary);
            if (aboutSummary) aboutSummary.textContent = i18n.getBilingualContent(this.profileData.summary);
        }
    }

    updateSkillsContent() {
        if (!this.skillsData) return;

        const container = document.getElementById('skillsContent');
        container.innerHTML = '';

        const renderSkillCategory = (key, data) => {
            const col = document.createElement('div');
            col.className = 'col-lg-6 col-md-12 reveal-fade revealed';

            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'skill-category';

            const title = document.createElement('h3');
            title.className = 'skill-category-title';
            title.textContent = i18n.getBilingualContent(data.label);

            const tagsDiv = document.createElement('div');
            tagsDiv.className = 'skill-tags';

            if (key === 'languages') {
                data.proficient.forEach(skill => {
                    const tag = document.createElement('span');
                    tag.className = 'skill-tag';
                    tag.textContent = skill;
                    tagsDiv.appendChild(tag);
                });
                data.familiar.forEach(skill => {
                    const tag = document.createElement('span');
                    tag.className = 'skill-tag';
                    tag.textContent = skill;
                    tag.style.opacity = '0.7';
                    tagsDiv.appendChild(tag);
                });
            } else if (key === 'ai_ml') {
                data.items.forEach(item => {
                    item.technologies.forEach(tech => {
                        const tag = document.createElement('span');
                        tag.className = 'skill-tag';
                        tag.textContent = tech;
                        tagsDiv.appendChild(tag);
                    });
                });
            } else if (key === 'data_engineering') {
                data.items.forEach(skill => {
                    const tag = document.createElement('span');
                    tag.className = 'skill-tag';
                    tag.textContent = i18n.getBilingualContent(skill);
                    tagsDiv.appendChild(tag);
                });
            } else if (key === 'interpersonal') {
                data.items.forEach(skill => {
                    const tag = document.createElement('span');
                    tag.className = 'skill-tag';
                    tag.textContent = i18n.getBilingualContent(skill);
                    tagsDiv.appendChild(tag);
                });
            } else {
                data.items.forEach(skill => {
                    const tag = document.createElement('span');
                    tag.className = 'skill-tag';
                    tag.textContent = skill;
                    tagsDiv.appendChild(tag);
                });
            }

            categoryDiv.appendChild(title);
            categoryDiv.appendChild(tagsDiv);
            col.appendChild(categoryDiv);
            container.appendChild(col);
        };

        renderSkillCategory('languages', this.skillsData.languages);
        renderSkillCategory('frameworks', this.skillsData.frameworks);
        renderSkillCategory('tools', this.skillsData.tools);
        renderSkillCategory('ai_ml', this.skillsData.ai_ml);
        renderSkillCategory('data_engineering', this.skillsData.data_engineering);
        renderSkillCategory('interpersonal', this.skillsData.interpersonal);
    }

    updateExperienceContent() {
        if (!this.experienceData) return;

        const container = document.getElementById('experienceContent');
        container.innerHTML = '';

        this.experienceData.forEach(exp => {
            const col = document.createElement('div');
            col.className = 'col-12 reveal-fade revealed';

            const card = document.createElement('div');
            card.className = 'experience-card';

            const header = document.createElement('div');
            header.className = 'experience-header';

            const title = document.createElement('h3');
            title.className = 'experience-title';
            title.textContent = i18n.getBilingualContent(exp.position);

            const company = document.createElement('div');
            company.className = 'experience-company';
            company.textContent = exp.company;

            const meta = document.createElement('div');
            meta.className = 'experience-meta';

            const dates = document.createElement('div');
            dates.className = 'meta-item';
            dates.innerHTML = `<i class="bi bi-calendar3"></i> <span>${this.formatDate(exp.startDate)} - ${exp.current ? i18n.translate('experience.current') : this.formatDate(exp.endDate)}</span>`;

            const location = document.createElement('div');
            location.className = 'meta-item';
            location.innerHTML = `<i class="bi bi-geo-alt"></i> <span>${i18n.getBilingualContent(exp.location)}</span>`;

            meta.appendChild(dates);
            meta.appendChild(location);

            header.appendChild(title);
            header.appendChild(company);
            header.appendChild(meta);

            const achievements = document.createElement('div');
            achievements.className = 'experience-achievements';

            const achievementsTitle = document.createElement('h4');
            achievementsTitle.className = 'h6 mb-3';
            achievementsTitle.textContent = i18n.translate('experience.achievements');

            const list = document.createElement('ul');
            exp.achievements.forEach(achievement => {
                const li = document.createElement('li');
                li.textContent = i18n.getBilingualContent(achievement);
                list.appendChild(li);
            });

            achievements.appendChild(achievementsTitle);
            achievements.appendChild(list);

            const techTags = document.createElement('div');
            techTags.className = 'tech-tags';
            exp.technologies.forEach(tech => {
                const tag = document.createElement('span');
                tag.className = 'tech-tag';
                tag.textContent = tech;
                techTags.appendChild(tag);
            });

            card.appendChild(header);
            card.appendChild(achievements);
            card.appendChild(techTags);
            col.appendChild(card);
            container.appendChild(col);
        });
    }

    updateEducationContent() {
        if (!this.educationData) return;

        const container = document.getElementById('educationContent');
        container.innerHTML = '';

        this.educationData.forEach(edu => {
            const col = document.createElement('div');
            col.className = 'col-12 reveal-fade revealed';

            const card = document.createElement('div');
            card.className = 'education-card';

            const header = document.createElement('div');
            header.className = 'education-header';

            const degree = document.createElement('h3');
            degree.className = 'education-degree';
            degree.textContent = i18n.getBilingualContent(edu.degree);

            const institution = document.createElement('div');
            institution.className = 'education-institution';
            institution.textContent = `${edu.institution} - ${edu.school}`;

            const meta = document.createElement('div');
            meta.className = 'education-meta';

            const dates = document.createElement('div');
            dates.className = 'meta-item';
            dates.innerHTML = `<i class="bi bi-calendar3"></i> <span>${this.formatDate(edu.startDate)} - ${this.formatDate(edu.endDate)}</span>`;

            const location = document.createElement('div');
            location.className = 'meta-item';
            location.innerHTML = `<i class="bi bi-geo-alt"></i> <span>${i18n.getBilingualContent(edu.location)}</span>`;

            const gpa = document.createElement('div');
            gpa.className = 'meta-item';
            gpa.innerHTML = `<i class="bi bi-award"></i> <span>${i18n.translate('education.gpa')}: ${i18n.getBilingualContent(edu.gpa)}</span>`;

            meta.appendChild(dates);
            meta.appendChild(location);
            meta.appendChild(gpa);

            header.appendChild(degree);
            header.appendChild(institution);
            if (edu.certificate) {
                const cert = document.createElement('div');
                cert.className = 'text-muted mt-2';
                cert.textContent = i18n.getBilingualContent(edu.certificate);
                header.appendChild(cert);
            }
            header.appendChild(meta);

            if (edu.coursework) {
                const coursework = document.createElement('div');
                coursework.className = 'education-coursework mt-3';

                const courseworkTitle = document.createElement('h4');
                courseworkTitle.className = 'h6 mb-2';
                courseworkTitle.textContent = i18n.translate('education.coursework');

                const list = document.createElement('ul');
                list.className = 'row';
                const courses = i18n.getBilingualContent(edu.coursework);
                courses.forEach(course => {
                    const li = document.createElement('li');
                    li.className = 'col-md-6';
                    li.textContent = course;
                    list.appendChild(li);
                });

                coursework.appendChild(courseworkTitle);
                coursework.appendChild(list);
                card.appendChild(header);
                card.appendChild(coursework);
            } else {
                card.appendChild(header);
            }

            col.appendChild(card);
            container.appendChild(col);
        });
    }

    updateCertificatesContent() {
        if (!this.certificatesData) return;

        const container = document.getElementById('certificatesContent');
        container.innerHTML = '';

        this.certificatesData.forEach(cert => {
            const col = document.createElement('div');
            col.className = 'col-md-6 col-lg-4 reveal-fade revealed';

            const card = document.createElement('div');
            card.className = 'certificate-card';

            // If certificate has URL, make it clickable
            if (cert.credentialUrl) {
                card.style.cursor = 'pointer';
                card.addEventListener('click', () => {
                    window.open(cert.credentialUrl, '_blank', 'noopener,noreferrer');
                });
                card.setAttribute('role', 'link');
                card.setAttribute('tabindex', '0');
                card.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        window.open(cert.credentialUrl, '_blank', 'noopener,noreferrer');
                    }
                });
            }

            const title = document.createElement('h3');
            title.className = 'certificate-title';
            title.textContent = i18n.getBilingualContent(cert.title);

            const issuer = document.createElement('div');
            issuer.className = 'certificate-issuer';
            issuer.textContent = cert.issuer;

            const date = document.createElement('div');
            date.className = 'certificate-date';
            date.innerHTML = `<i class="bi bi-calendar3"></i> ${this.formatDate(cert.date)}`;

            card.appendChild(title);
            card.appendChild(issuer);
            card.appendChild(date);

            // Add credential link indicator if URL exists
            if (cert.credentialUrl) {
                const linkIndicator = document.createElement('div');
                linkIndicator.className = 'certificate-link-indicator mt-2';
                linkIndicator.innerHTML = `<i class="bi bi-box-arrow-up-right"></i> <span>${i18n.translate('certificates.viewCredential')}</span>`;
                card.appendChild(linkIndicator);
            }

            col.appendChild(card);
            container.appendChild(col);
        });
    }

    setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (href === '#' || href === '#!') return;

                e.preventDefault();
                const target = document.querySelector(href);

                if (target) {
                    const offset = 80; // Account for fixed navbar
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
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

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new PortfolioApp());
} else {
    new PortfolioApp();
}

/**
 * API Module
 * Handles all API calls to Netlify Functions
 */

const API_BASE = '/.netlify/functions';

class API {
    async fetchProfile() {
        try {
            const response = await fetch(`${API_BASE}/profile`);
            if (!response.ok) throw new Error('Failed to fetch profile');
            return await response.json();
        } catch (error) {
            console.error('Error fetching profile:', error);
            throw error;
        }
    }

    async fetchExperience() {
        try {
            const response = await fetch(`${API_BASE}/experience`);
            if (!response.ok) throw new Error('Failed to fetch experience');
            return await response.json();
        } catch (error) {
            console.error('Error fetching experience:', error);
            throw error;
        }
    }

    async fetchEducation() {
        try {
            const response = await fetch(`${API_BASE}/education`);
            if (!response.ok) throw new Error('Failed to fetch education');
            return await response.json();
        } catch (error) {
            console.error('Error fetching education:', error);
            throw error;
        }
    }

    async fetchSkills() {
        try {
            const response = await fetch(`${API_BASE}/skills`);
            if (!response.ok) throw new Error('Failed to fetch skills');
            return await response.json();
        } catch (error) {
            console.error('Error fetching skills:', error);
            throw error;
        }
    }

    async fetchCertificates() {
        try {
            const response = await fetch(`${API_BASE}/certificates`);
            if (!response.ok) throw new Error('Failed to fetch certificates');
            return await response.json();
        } catch (error) {
            console.error('Error fetching certificates:', error);
            throw error;
        }
    }

    async fetchProjects() {
        try {
            const response = await fetch(`${API_BASE}/projects`);
            if (!response.ok) throw new Error('Failed to fetch projects');
            return await response.json();
        } catch (error) {
            console.error('Error fetching projects:', error);
            throw error;
        }
    }

    async submitContactForm(data) {
        try {
            const response = await fetch(`${API_BASE}/contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (!response.ok) {
                throw result.error || new Error('Failed to submit contact form');
            }

            return result;
        } catch (error) {
            console.error('Error submitting contact form:', error);
            throw error;
        }
    }
}

// Create and export singleton instance
const api = new API();
export default api;

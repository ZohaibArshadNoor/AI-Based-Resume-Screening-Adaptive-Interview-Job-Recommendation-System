import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Attach JWT to every request automatically
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

// Handle 401 globally — redirect to login
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');

            window.location.href = '/login';
        }

        return Promise.reject(error);
    }
);

// ================================
// Job Search API Calls
// ================================

export const findJobs = (payload) =>
    api.post('/jobs/find', payload);

export const getJobRecommendations = () =>
    api.get('/jobs/recommendations');

export default api;
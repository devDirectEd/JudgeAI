import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://backend-j7ru.onrender.com',
});

axiosInstance.interceptors.request.use(
    config => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    error => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem('refreshToken');
            try {
                const { data } = await axiosInstance.post('/auth/refresh', { refreshToken });
                localStorage.setItem('accessToken', data.accessToken);
                axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                console.error('Failed to refresh token:', refreshError);
                // handle logout and redirect to login if token refresh fails
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
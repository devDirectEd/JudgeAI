import axios from 'axios';

const axiosInstance = axios.create({
<<<<<<< Updated upstream
    baseURL: 'https://backend-j7ru.onrender.com',
=======
    baseURL: 'https://01mv1z46-8080.inc1.devtunnels.ms/api/v1',
    headers: {
        'Content-Type': 'application/json'
    }
>>>>>>> Stashed changes
});

// Request interceptor
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

// Response interceptor
axiosInstance.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;
        
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem('refreshToken');
            
            try {
                const { data } = await axios.post(
                    `${axiosInstance.defaults.baseURL}api/v1/auth/refresh`,
                    { refreshToken }
                );
                
                localStorage.setItem('accessToken', data.accessToken);
                if (data.refreshToken) {
                    localStorage.setItem('refreshToken', data.refreshToken);
                }
                
                originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
                return axiosInstance(originalRequest);
                
            } catch (refreshError) {
                console.error('Token refresh failed:', refreshError);
                localStorage.clear();
                window.location.href = '/admin/login';
                return Promise.reject(refreshError);
            }
        }

        if (error.response?.status === 403) {
            localStorage.clear();
            window.location.href = '/admin/login';
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
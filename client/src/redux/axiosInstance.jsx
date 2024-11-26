import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://judgeai.onrender.com/api/v1',
    headers: {
        'Content-Type': 'application/json'
    }
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
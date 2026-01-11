import axios from 'axios';

export const fetchEntities = async (url: string, token: string) => {
    // Ensure protocol
    let fullUrl = url;
    if (!fullUrl.startsWith('http://') && !fullUrl.startsWith('https://')) {
        fullUrl = `http://${fullUrl}`;
    }
    // Remove trailing slash
    fullUrl = fullUrl.replace(/\/$/, '');

    // Use proxy in development
    const isDev = import.meta.env.DEV;
    const requestUrl = isDev ? '/api/states' : `${fullUrl}/api/states`;

    try {
        const response = await axios.get(requestUrl, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            timeout: 5000,
        });
        return response.data;
    } catch (error: any) {
        if (error.code === 'ERR_NETWORK') {
            throw new Error('Network Error: Check if HA URL is correct and CORS is enabled in HA configuration.yaml');
        }
        console.error('Error fetching entities:', error);
        throw error;
    }
};

import config from '../config';

export default class StatisticsApi {

    static getOverviewStats = async () => {
        const url = `${config.url.api}/statistics/overview`;
        const token = localStorage.getItem('token');
        const res = await fetch(url, {
            headers: {
                'Authorization': token ? `Bearer ${token}` : ''
            }
        });
        const json = await res.json();
        if (!res.ok) {
            throw json;
        }
        return json;
    }

    static getTrends = async (timeRange = 30) => {
        const url = `${config.url.api}/statistics/trends?days=${timeRange}`;
        const token = localStorage.getItem('token');
        const res = await fetch(url, {
            headers: {
                'Authorization': token ? `Bearer ${token}` : ''
            }
        });
        const json = await res.json();
        if (!res.ok) {
            throw json;
        }
        return json;
    }

    static getTopOrganizations = async (limit = 5) => {
        const url = `${config.url.api}/statistics/top-organizations?limit=${limit}`;
        const token = localStorage.getItem('token');
        const res = await fetch(url, {
            headers: {
                'Authorization': token ? `Bearer ${token}` : ''
            }
        });
        const json = await res.json();
        if (!res.ok) {
            throw json;
        }
        return json;
    }

    static getTopAuthors = async (limit = 5) => {
        const url = `${config.url.api}/statistics/top-authors?limit=${limit}`;
        const token = localStorage.getItem('token');
        const res = await fetch(url, {
            headers: {
                'Authorization': token ? `Bearer ${token}` : ''
            }
        });
        const json = await res.json();
        if (!res.ok) {
            throw json;
        }
        return json;
    }

    static getRecentActivity = async (limit = 10) => {
        const url = `${config.url.api}/statistics/recent-activity?limit=${limit}`;
        const token = localStorage.getItem('token');
        const res = await fetch(url, {
            headers: {
                'Authorization': token ? `Bearer ${token}` : ''
            }
        });
        const json = await res.json();
        if (!res.ok) {
            throw json;
        }
        return json;
    }

    static getClipsByType = async () => {
        const url = `${config.url.api}/statistics/clips-by-type`;
        const token = localStorage.getItem('token');
        const res = await fetch(url, {
            headers: {
                'Authorization': token ? `Bearer ${token}` : ''
            }
        });
        const json = await res.json();
        if (!res.ok) {
            throw json;
        }
        return json;
    }

    static getSubtitleStats = async () => {
        const url = `${config.url.api}/statistics/subtitle-stats`;
        const token = localStorage.getItem('token');
        const res = await fetch(url, {
            headers: {
                'Authorization': token ? `Bearer ${token}` : ''
            }
        });
        const json = await res.json();
        if (!res.ok) {
            throw json;
        }
        return json;
    }

    static exportReport = async (timeRange = 30, format = 'json') => {
        const url = `${config.url.api}/statistics/export?days=${timeRange}&format=${format}`;
        const token = localStorage.getItem('token');
        const res = await fetch(url, {
            headers: {
                'Authorization': token ? `Bearer ${token}` : ''
            }
        });
        
        if (!res.ok) {
            const json = await res.json();
            throw json;
        }
        
        if (format === 'json') {
            return await res.json();
        } else {
            return await res.blob();
        }
    }
}

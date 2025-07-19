import config from '../config';

export default class ClipApi {

    static findById = async (clipId) => {
        const url = `${config.url.api}/clips/${clipId}`;
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

    static findByOrganizationId = async (organizationId, keyword) => {
        let url = `${config.url.api}/organizations/${organizationId}/clips`;
        if (keyword) {
            const params = new URLSearchParams();
            params.append('keyword', keyword);
            url = `${url}?${params.toString()}`;
        }
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

    static fetchSegment = async (clipId, startTime, endTime, segmentName, audio, danmaku, forward) => {
        const url = `${config.url.api}/clips/${clipId}/segment?startTime=${startTime}&endTime=${endTime}&segmentName=${segmentName}&audio=${audio}&danmaku=${danmaku}&forward=${forward}`;
        const res = await fetch(url);
        const json = await res.json();
        if (!res.ok) {
            throw json;
        }
        return json;
    }
}
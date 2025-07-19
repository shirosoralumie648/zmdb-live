import config from '../config';

export default class SubtitleApi {

    static findByClipId = async (clipId, keyword = '') => {
        const url = keyword 
            ? `${config.url.api}/clips/${clipId}/subtitles?keyword=${encodeURIComponent(keyword)}`
            : `${config.url.api}/clips/${clipId}/subtitles`;
        const res = await fetch(url);
        const json = await res.json();
        if (!res.ok) {
            throw json;
        }
        return json;
    }

    static uploadSubtitles = async (clipId, srtContent) => {
        const url = `${config.url.api}/clips/${clipId}/subtitles`;
        const token = localStorage.getItem('token');
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain',
                'Authorization': token ? `Bearer ${token}` : ''
            },
            body: srtContent
        });
        if (!res.ok) {
            const json = await res.json();
            throw json;
        }
        return true;
    }

    static updateOffset = async (clipId, offset) => {
        const url = `${config.url.api}/clips/${clipId}/subtitles`;
        const token = localStorage.getItem('token');
        const res = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token ? `Bearer ${token}` : ''
            },
            body: JSON.stringify({ offset })
        });
        if (!res.ok) {
            const json = await res.json();
            throw json;
        }
        return true;
    }

    static downloadSrt = async (clipId) => {
        const url = `${config.url.api}/clips/${clipId}/srt`;
        const res = await fetch(url);
        if (!res.ok) {
            const json = await res.json();
            throw json;
        }
        return await res.text();
    }

    static getSubtitleSize = async (clipId) => {
        const url = `${config.url.api}/clips/${clipId}/subtitles/size`;
        const res = await fetch(url);
        const json = await res.json();
        if (!res.ok) {
            throw json;
        }
        return json;
    }
}
import config from '../config';

const VideoApi = {
    // 创建新视频
    create: async (videoData) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${config.url.api}/videos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(videoData)
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || '创建视频失败');
        }
        
        return await response.json();
    },

    // 更新视频信息
    update: async (id, videoData) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${config.url.api}/videos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(videoData)
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || '更新视频失败');
        }
        
        return await response.json();
    },

    // 删除视频
    delete: async (id) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${config.url.api}/videos/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || '删除视频失败');
        }
        
        return await response.json();
    },

    // 根据ID获取视频
    findById: async (id) => {
        const response = await fetch(`${config.url.api}/videos/${id}`);
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || '获取视频失败');
        }
        
        return await response.json();
    },

    // 获取所有视频
    findAll: async () => {
        const response = await fetch(`${config.url.api}/videos`);
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || '获取视频列表失败');
        }
        
        return await response.json();
    },

    // 根据作者ID获取视频列表
    findByAuthorId: async (authorId) => {
        const response = await fetch(`${config.url.api}/authors/${authorId}/videos`);
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || '获取作者视频列表失败');
        }
        
        return await response.json();
    },

    // 根据组织ID获取视频列表
    findByOrganizationId: async (organizationId) => {
        const response = await fetch(`${config.url.api}/organizations/${organizationId}/videos`);
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || '获取组织视频列表失败');
        }
        
        return await response.json();
    },

    // 获取视频的剪辑片段列表
    getClips: async (videoId) => {
        const response = await fetch(`${config.url.api}/videos/${videoId}/clips`);
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || '获取视频剪辑列表失败');
        }
        
        return await response.json();
    },

    // 为视频创建剪辑片段
    createClip: async (videoId, clipData) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${config.url.api}/videos/${videoId}/clips`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(clipData)
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || '创建剪辑片段失败');
        }
        
        return await response.json();
    },

    // 格式化视频时长（秒转换为 HH:MM:SS）
    formatDuration: (seconds) => {
        if (!seconds) return '00:00:00';
        
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;
        
        return [hours, minutes, remainingSeconds]
            .map(val => val.toString().padStart(2, '0'))
            .join(':');
    },

    // 解析时间字符串为秒数
    parseDuration: (timeString) => {
        if (!timeString) return 0;
        
        const parts = timeString.split(':').map(Number);
        if (parts.length === 3) {
            return parts[0] * 3600 + parts[1] * 60 + parts[2];
        } else if (parts.length === 2) {
            return parts[0] * 60 + parts[1];
        } else {
            return parts[0] || 0;
        }
    },

    // 格式化文件大小
    formatFileSize: (bytes) => {
        if (!bytes) return '0 B';
        
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        
        return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
    },

    // 获取视频类型标签
    getTypeLabel: (type) => {
        switch (type) {
            case 1: return { label: '本地视频', color: 'success' };
            case 2: return { label: 'B站视频', color: 'primary' };
            case 3: return { label: '直播录像', color: 'warning' };
            default: return { label: '未知', color: 'default' };
        }
    }
};

export default VideoApi;

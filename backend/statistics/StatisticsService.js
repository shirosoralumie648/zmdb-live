import StatisticsDao from './StatisticsDao.js';
import UserService from '../user/UserService.js';

class StatisticsService {
    
    constructor() {
        this.statisticsDao = new StatisticsDao();
    }

    async getOverviewStats() {
        try {
            const stats = await this.statisticsDao.getOverviewStats();
            return {
                success: true,
                data: stats
            };
        } catch (error) {
            console.error('获取概览统计失败:', error);
            return {
                success: false,
                message: '获取概览统计失败'
            };
        }
    }

    async getTrends(days = 30) {
        try {
            const trends = await this.statisticsDao.getTrends(days);
            return {
                success: true,
                data: trends
            };
        } catch (error) {
            console.error('获取趋势数据失败:', error);
            return {
                success: false,
                message: '获取趋势数据失败'
            };
        }
    }

    async getTopOrganizations(limit = 5) {
        try {
            const topOrgs = await this.statisticsDao.getTopOrganizations(limit);
            return {
                success: true,
                data: topOrgs
            };
        } catch (error) {
            console.error('获取热门组织失败:', error);
            return {
                success: false,
                message: '获取热门组织失败'
            };
        }
    }

    async getTopAuthors(limit = 5) {
        try {
            const topAuthors = await this.statisticsDao.getTopAuthors(limit);
            return {
                success: true,
                data: topAuthors
            };
        } catch (error) {
            console.error('获取热门作者失败:', error);
            return {
                success: false,
                message: '获取热门作者失败'
            };
        }
    }

    async getRecentActivity(limit = 10) {
        try {
            const activities = await this.statisticsDao.getRecentActivity(limit);
            return {
                success: true,
                data: activities
            };
        } catch (error) {
            console.error('获取最近活动失败:', error);
            return {
                success: false,
                message: '获取最近活动失败'
            };
        }
    }

    async getClipsByType() {
        try {
            const clipsByType = await this.statisticsDao.getClipsByType();
            return {
                success: true,
                data: clipsByType
            };
        } catch (error) {
            console.error('获取剪辑类型分布失败:', error);
            return {
                success: false,
                message: '获取剪辑类型分布失败'
            };
        }
    }

    async getSubtitleStats() {
        try {
            const subtitleStats = await this.statisticsDao.getSubtitleStats();
            return {
                success: true,
                data: subtitleStats
            };
        } catch (error) {
            console.error('获取字幕统计失败:', error);
            return {
                success: false,
                message: '获取字幕统计失败'
            };
        }
    }

    async exportReport(days = 30, format = 'json') {
        try {
            const [overview, trends, topOrgs, topAuthors, activities, clipsByType, subtitleStats] = await Promise.all([
                this.statisticsDao.getOverviewStats(),
                this.statisticsDao.getTrends(days),
                this.statisticsDao.getTopOrganizations(10),
                this.statisticsDao.getTopAuthors(10),
                this.statisticsDao.getRecentActivity(20),
                this.statisticsDao.getClipsByType(),
                this.statisticsDao.getSubtitleStats()
            ]);

            const report = {
                generatedAt: new Date().toISOString(),
                timeRange: `${days} 天`,
                overview,
                trends,
                topOrganizations: topOrgs,
                topAuthors,
                recentActivity: activities,
                clipsByType,
                subtitleStats
            };

            return {
                success: true,
                data: report,
                format
            };
        } catch (error) {
            console.error('导出报告失败:', error);
            return {
                success: false,
                message: '导出报告失败'
            };
        }
    }

    // 权限检查
    async checkAdminPermission(token) {
        if (!token) {
            return false;
        }
        return await UserService.isAdmin(token);
    }
}

export default StatisticsService;

import error from "../error.js";
import validation from "../validation.js";

export default class VideoService {

    /**
     * 创建新视频
     * @param {authorId} 作者ID
     * @param {title} 视频标题
     * @param {description} 视频描述
     * @param {duration} 视频时长（秒）
     * @param {fileUrl} 视频文件URL
     * @param {coverUrl} 视频封面URL
     * @param {type} 视频类型：1=本地视频，2=B站视频，3=直播录像
     */
    insert = async (ctx) => {
        // 只有admin才可插入
        if (!ctx.userService.isAdmin(ctx.state.user)) {
            throw error.auth.Unauthorized;
        }
        
        const entity = ctx.request.body;
        let video = {};
        
        // 检查参数合法性
        if (!entity) {
            throw { code: 400, message: '请求参数缺失' };
        }
        
        const authorId = entity.authorId;
        if (!authorId) {
            throw { code: 400, message: '作者ID不能为空' };
        }
        
        // 验证作者是否存在
        const author = ctx.authorDao.findById(authorId);
        if (!author) {
            throw error.author.NotFound;
        }
        
        video.authorId = authorId;
        
        // 验证标题
        const title = entity.title || '';
        if (title.length < validation.clip.title.lowerLimit) {
            throw error.clip.title.LengthTooShort;
        }
        if (title.length > validation.clip.title.upperLimit) {
            throw error.clip.title.LengthTooLong;
        }
        video.title = title;
        
        // 设置其他字段
        video.description = entity.description || '';
        video.duration = parseInt(entity.duration) || 0;
        video.fileUrl = entity.fileUrl || '';
        video.coverUrl = entity.coverUrl || '';
        video.uploadTime = entity.uploadTime || new Date().toISOString().slice(0, 19).replace('T', ' ');
        video.status = entity.status || 1;
        video.fileSize = parseInt(entity.fileSize) || 0;
        video.type = parseInt(entity.type) || 1;
        
        if (!video.fileUrl) {
            throw { code: 400, message: '视频文件URL不能为空' };
        }
        
        const result = ctx.videoDao.insert(video);
        const id = result.lastInsertRowid;
        
        const newVideo = ctx.videoDao.findById(id);
        ctx.logger.info(`新增video: ${JSON.stringify(newVideo)}`);
        return newVideo;
    }

    /**
     * 更新视频信息
     */
    update = async (ctx) => {
        // 只有admin才可更新
        if (!ctx.userService.isAdmin(ctx.state.user)) {
            throw error.auth.Unauthorized;
        }
        
        const id = parseInt(ctx.params.id);
        const entity = ctx.request.body;
        
        if (!entity) {
            throw { code: 400, message: '请求参数缺失' };
        }
        
        // 检查视频是否存在
        const existingVideo = ctx.videoDao.findById(id);
        if (!existingVideo) {
            throw { code: 404, message: '视频不存在' };
        }
        
        let video = { id };
        
        // 验证作者
        if (entity.authorId) {
            const author = ctx.authorDao.findById(entity.authorId);
            if (!author) {
                throw error.author.NotFound;
            }
            video.authorId = entity.authorId;
        } else {
            video.authorId = existingVideo.authorId;
        }
        
        // 验证标题
        if (entity.title !== undefined) {
            const title = entity.title || '';
            if (title.length < validation.clip.title.lowerLimit) {
                throw error.clip.title.LengthTooShort;
            }
            if (title.length > validation.clip.title.upperLimit) {
                throw error.clip.title.LengthTooLong;
            }
            video.title = title;
        } else {
            video.title = existingVideo.title;
        }
        
        // 更新其他字段
        video.description = entity.description !== undefined ? entity.description : existingVideo.description;
        video.duration = entity.duration !== undefined ? parseInt(entity.duration) : existingVideo.duration;
        video.fileUrl = entity.fileUrl !== undefined ? entity.fileUrl : existingVideo.fileUrl;
        video.coverUrl = entity.coverUrl !== undefined ? entity.coverUrl : existingVideo.coverUrl;
        video.uploadTime = entity.uploadTime !== undefined ? entity.uploadTime : existingVideo.uploadTime;
        video.status = entity.status !== undefined ? parseInt(entity.status) : existingVideo.status;
        video.fileSize = entity.fileSize !== undefined ? parseInt(entity.fileSize) : existingVideo.fileSize;
        video.type = entity.type !== undefined ? parseInt(entity.type) : existingVideo.type;
        
        ctx.videoDao.update(video);
        
        const updatedVideo = ctx.videoDao.findById(id);
        ctx.logger.info(`更新video: ${JSON.stringify(updatedVideo)}`);
        return updatedVideo;
    }

    /**
     * 删除视频
     */
    deleteById = async (ctx) => {
        // 只有admin才可删除
        if (!ctx.userService.isAdmin(ctx.state.user)) {
            throw error.auth.Unauthorized;
        }
        
        const id = parseInt(ctx.params.id);
        
        // 检查视频是否存在
        const existingVideo = ctx.videoDao.findById(id);
        if (!existingVideo) {
            throw { code: 404, message: '视频不存在' };
        }
        
        // 检查是否有关联的剪辑片段
        const clips = ctx.videoDao.getClipsByVideoId(id);
        if (clips && clips.length > 0) {
            throw { code: 400, message: '该视频下还有剪辑片段，请先删除相关剪辑' };
        }
        
        ctx.videoDao.deleteById(id);
        ctx.logger.info(`删除video: ${id}`);
        return { success: true, message: '视频删除成功' };
    }

    /**
     * 根据ID查找视频
     */
    findById = async (ctx) => {
        const id = parseInt(ctx.params.id);
        const video = ctx.videoDao.findById(id);
        
        if (!video) {
            throw { code: 404, message: '视频不存在' };
        }
        
        return video;
    }

    /**
     * 根据作者ID查找视频列表
     */
    findByAuthorId = async (ctx) => {
        const authorId = parseInt(ctx.params.authorId);
        return ctx.videoDao.findByAuthorId(authorId);
    }

    /**
     * 根据组织ID查找视频列表
     */
    findByOrganizationId = async (ctx) => {
        const organizationId = parseInt(ctx.params.organizationId);
        return ctx.videoDao.findByOrganizationId(organizationId);
    }

    /**
     * 获取所有视频列表
     */
    findAll = async (ctx) => {
        return ctx.videoDao.findAll();
    }

    /**
     * 获取视频的剪辑片段列表
     */
    getClips = async (ctx) => {
        const videoId = parseInt(ctx.params.id);
        
        // 检查视频是否存在
        const video = ctx.videoDao.findById(videoId);
        if (!video) {
            throw { code: 404, message: '视频不存在' };
        }
        
        const clips = ctx.videoDao.getClipsByVideoId(videoId);
        return clips;
    }

    /**
     * 为视频创建剪辑片段
     */
    createClip = async (ctx) => {
        // 只有admin才可创建剪辑
        if (!ctx.userService.isAdmin(ctx.state.user)) {
            throw error.auth.Unauthorized;
        }
        
        const videoId = parseInt(ctx.params.id);
        const entity = ctx.request.body;
        
        if (!entity) {
            throw { code: 400, message: '请求参数缺失' };
        }
        
        // 检查视频是否存在
        const video = ctx.videoDao.findById(videoId);
        if (!video) {
            throw { code: 404, message: '视频不存在' };
        }
        
        // 验证时间参数
        const startTime = parseInt(entity.startTime) || 0;
        const endTime = parseInt(entity.endTime) || 0;
        
        if (startTime >= endTime) {
            throw { code: 400, message: '结束时间必须大于开始时间' };
        }
        
        if (endTime > video.duration) {
            throw { code: 400, message: '结束时间不能超过视频总时长' };
        }
        
        // 创建剪辑片段
        let clip = {
            authorId: video.authorId,
            title: entity.title || `${video.title}_片段_${startTime}-${endTime}`,
            datetime: new Date().toISOString().slice(0, 19).replace('T', ' '),
            cover: video.coverUrl || '',
            type: 3, // 本地源
            playUrl: video.fileUrl,
            redirectUrl: '',
            videoId: videoId,
            startTime: startTime,
            endTime: endTime
        };
        
        const result = ctx.clipDao.insert(clip);
        const clipId = result.lastInsertRowid;
        
        const newClip = ctx.clipDao.findById(clipId);
        ctx.logger.info(`为视频${videoId}创建剪辑片段: ${JSON.stringify(newClip)}`);
        return newClip;
    }
}

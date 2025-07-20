export default class VideoDao {

    constructor(db) {
        this.db = db;
        this.__init();
    }

    __init = () => {
        const sql = `CREATE TABLE IF NOT EXISTS video(
            id INTEGER PRIMARY KEY AUTOINCREMENT, 
            authorId INTEGER NOT NULL, 
            title TEXT NOT NULL, 
            description TEXT, 
            duration INTEGER, 
            fileUrl TEXT NOT NULL, 
            coverUrl TEXT, 
            uploadTime TEXT NOT NULL, 
            status INTEGER DEFAULT 1,
            fileSize INTEGER DEFAULT 0,
            type INTEGER DEFAULT 1
        )`;
        this.db.exec(sql);
        
        // 为clip表添加video关联字段（如果不存在）
        try {
            this.db.exec('ALTER TABLE clip ADD COLUMN videoId INTEGER');
            this.db.exec('ALTER TABLE clip ADD COLUMN startTime INTEGER DEFAULT 0');
            this.db.exec('ALTER TABLE clip ADD COLUMN endTime INTEGER DEFAULT 0');
        } catch (e) {
            // 字段可能已存在，忽略错误
        }
    }

    __toDTO = (entity) => {
        if (!entity) return null;
        return {
            id: entity.video_id,
            authorId: entity.video_authorId,
            title: entity.video_title,
            description: entity.video_description,
            duration: entity.video_duration,
            fileUrl: entity.video_fileUrl,
            coverUrl: entity.video_coverUrl,
            uploadTime: entity.video_uploadTime,
            status: entity.video_status,
            fileSize: entity.video_fileSize,
            type: entity.video_type,
            author: entity.author_id ? {
                id: entity.author_id,
                organizationId: entity.author_organizationId,
                uid: entity.author_uid,
                name: entity.author_name,
                avatar: entity.author_avatar,
                organization: entity.organization_id ? {
                    id: entity.organization_id,
                    name: entity.organization_name,
                    avatar: entity.organization_avatar
                } : null
            } : null
        };
    }

    insert = (video) => {
        const sql = `INSERT INTO video(
            authorId, title, description, duration, fileUrl, coverUrl, 
            uploadTime, status, fileSize, type
        ) VALUES(
            @authorId, @title, @description, @duration, @fileUrl, @coverUrl, 
            @uploadTime, @status, @fileSize, @type
        )`;
        const stmt = this.db.prepare(sql);
        return stmt.run(video);
    }

    update = (video) => {
        const sql = `UPDATE video SET 
            authorId=@authorId, title=@title, description=@description, 
            duration=@duration, fileUrl=@fileUrl, coverUrl=@coverUrl, 
            uploadTime=@uploadTime, status=@status, fileSize=@fileSize, type=@type 
        WHERE id=@id`;
        const stmt = this.db.prepare(sql);
        return stmt.run(video);
    }

    deleteById = (id) => {
        const sql = 'DELETE FROM video WHERE id=?';
        const stmt = this.db.prepare(sql);
        return stmt.run(id);
    }

    findById = (id) => {
        const sql = `SELECT 
            video.id as video_id,
            video.authorId as video_authorId,
            video.title as video_title,
            video.description as video_description,
            video.duration as video_duration,
            video.fileUrl as video_fileUrl,
            video.coverUrl as video_coverUrl,
            video.uploadTime as video_uploadTime,
            video.status as video_status,
            video.fileSize as video_fileSize,
            video.type as video_type,
            author.id as author_id,
            author.organizationId as author_organizationId,
            author.uid as author_uid,
            author.name as author_name,
            author.avatar as author_avatar,
            organization.id as organization_id,
            organization.name as organization_name,
            organization.avatar as organization_avatar
        FROM video 
        LEFT JOIN author ON video.authorId=author.id 
        LEFT JOIN organization ON author.organizationId=organization.id 
        WHERE video.id=?`;
        const stmt = this.db.prepare(sql);
        const result = stmt.get(id);
        return this.__toDTO(result);
    }

    findByAuthorId = (authorId) => {
        const sql = `SELECT 
            video.id as video_id,
            video.authorId as video_authorId,
            video.title as video_title,
            video.description as video_description,
            video.duration as video_duration,
            video.fileUrl as video_fileUrl,
            video.coverUrl as video_coverUrl,
            video.uploadTime as video_uploadTime,
            video.status as video_status,
            video.fileSize as video_fileSize,
            video.type as video_type,
            author.id as author_id,
            author.organizationId as author_organizationId,
            author.uid as author_uid,
            author.name as author_name,
            author.avatar as author_avatar,
            organization.id as organization_id,
            organization.name as organization_name,
            organization.avatar as organization_avatar
        FROM video 
        LEFT JOIN author ON video.authorId=author.id 
        LEFT JOIN organization ON author.organizationId=organization.id 
        WHERE video.authorId=? 
        ORDER BY video.uploadTime DESC`;
        const stmt = this.db.prepare(sql);
        return stmt.all(authorId).map(item => this.__toDTO(item));
    }

    findByOrganizationId = (organizationId) => {
        const sql = `SELECT 
            video.id as video_id,
            video.authorId as video_authorId,
            video.title as video_title,
            video.description as video_description,
            video.duration as video_duration,
            video.fileUrl as video_fileUrl,
            video.coverUrl as video_coverUrl,
            video.uploadTime as video_uploadTime,
            video.status as video_status,
            video.fileSize as video_fileSize,
            video.type as video_type,
            author.id as author_id,
            author.organizationId as author_organizationId,
            author.uid as author_uid,
            author.name as author_name,
            author.avatar as author_avatar,
            organization.id as organization_id,
            organization.name as organization_name,
            organization.avatar as organization_avatar
        FROM video 
        LEFT JOIN author ON video.authorId=author.id 
        LEFT JOIN organization ON author.organizationId=organization.id 
        WHERE organization.id=? 
        ORDER BY video.uploadTime DESC`;
        const stmt = this.db.prepare(sql);
        return stmt.all(organizationId).map(item => this.__toDTO(item));
    }

    findAll = () => {
        const sql = `SELECT 
            video.id as video_id,
            video.authorId as video_authorId,
            video.title as video_title,
            video.description as video_description,
            video.duration as video_duration,
            video.fileUrl as video_fileUrl,
            video.coverUrl as video_coverUrl,
            video.uploadTime as video_uploadTime,
            video.status as video_status,
            video.fileSize as video_fileSize,
            video.type as video_type,
            author.id as author_id,
            author.organizationId as author_organizationId,
            author.uid as author_uid,
            author.name as author_name,
            author.avatar as author_avatar,
            organization.id as organization_id,
            organization.name as organization_name,
            organization.avatar as organization_avatar
        FROM video 
        LEFT JOIN author ON video.authorId=author.id 
        LEFT JOIN organization ON author.organizationId=organization.id 
        ORDER BY video.uploadTime DESC`;
        const stmt = this.db.prepare(sql);
        return stmt.all().map(item => this.__toDTO(item));
    }

    // 获取视频的剪辑片段
    getClipsByVideoId = (videoId) => {
        const sql = `SELECT 
            clip.id as clip_id,
            clip.authorId as clip_authorId,
            clip.title as clip_title,
            clip.datetime as clip_datetime,
            clip.cover as clip_cover,
            clip.type as clip_type,
            clip.playUrl as clip_playUrl,
            clip.redirectUrl as clip_redirectUrl,
            clip.videoId as clip_videoId,
            clip.startTime as clip_startTime,
            clip.endTime as clip_endTime
        FROM clip 
        WHERE clip.videoId=? 
        ORDER BY clip.startTime ASC`;
        const stmt = this.db.prepare(sql);
        return stmt.all(videoId);
    }
}

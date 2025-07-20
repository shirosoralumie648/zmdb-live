import error from "../error.js";
import validation from "../validation.js";

export default class AuthorService {

    /**
     * @param {organizationId} 组织id 
     * @param {uid} 作者的B站账号
     * @param {name} 作者的B站昵称，长度不能低于1字符，不能超过20字符
     * @param {avatar} 作者B站头像地址
     */
    insert = async (ctx) => {
        // 只有admin才可插入
        if (!ctx.userService.isAdmin(ctx.state.user)) {
            throw error.auth.Unauthorized;
        }
        const entity = ctx.request.body;
        let author = {};
        // 检查参数合法性
        if (!entity) {
            throw { code: 400, message: '请求参数缺失' };
        }
        const organizationId = entity.organizationId;
        if (!organizationId) {
            throw { code: 400, message: '组织ID不能为空' };
        }
        //鉴权 - 管理员可以操作所有组织
        if (ctx.state.user.role !== 'admin') {
            throw error.auth.Unauthorized;
        }
        if (!ctx.organizationDao.findById(organizationId)) {
            throw error.organization.NotFound;
        }
        author.organizationId = organizationId;

        const name = entity.name || '';
        if (name.length < validation.author.name.lowerLimit) {
            throw error.author.name.LengthTooShort;
        }
        if (name.length > validation.author.name.upperLimit) {
            throw error.author.name.LengthTooLong;
        }
        author.name = name;
        author.uid = entity.uid || '';
        author.avatar = entity.avatar || '';

        const r = ctx.authorDao.insert(author);
        const id = r.lastInsertRowid;

        author = ctx.authorDao.findById(id);
        ctx.logger.info(`新增author:${author}`);
        return author;
    }

    /**
     * @param {organizationId} 组织id 
     * @param {uid} 作者的B站账号
     * @param {name} 作者的B站昵称，长度不能低于1字符，不能超过20字符
     * @param {avatar} 作者B站头像地址
     */
    update = async (ctx) => {
        // 只有admin才可更新
        if (!ctx.userService.isAdmin(ctx.state.user)) {
            throw error.auth.Unauthorized;
        }
        const id = parseInt(ctx.params.id);
        const entity = ctx.request.body;
        // 检查参数合法性
        let author = ctx.authorDao.findById(id);
        if (!author) {
            throw error.author.NotFound;
        }
        if (entity.hasOwnProperty('organizationId')) {
            const organizationId = entity.organizationId;
            if (!ctx.organizationDao.findById(organizationId)) {
                throw error.organization.NotFound;
            }
            author.organizationId = organizationId;
        }
        if (entity.hasOwnProperty('uid')) {
            author.uid = entity.uid;
        }
        if (entity.hasOwnProperty('name')) {
            const name = entity.name || '';
            if (name.length < validation.author.name.lowerLimit) {
                throw error.author.name.LengthTooShort;
            }
            if (name.length > validation.author.name.upperLimit) {
                throw error.author.name.LengthTooLong;
            }
            author.name = name;
        }
        if (entity.hasOwnProperty('avatar')) {
            author.avatar = entity.avatar;
        }

        ctx.authorDao.update(author);

        author = ctx.authorDao.findById(id);
        ctx.logger.info(`更新author:${author}`);
        return author;
    }

    deleteById = async (ctx) => {
        if (!ctx.userService.isAdmin(ctx.state.user)) {
            throw error.auth.Unauthorized;
        }
        const id = parseInt(ctx.params.id);
        const author = ctx.authorDao.findById(id);
        if (!author) {
            throw error.author.NotFound;
        }
        ctx.authorDao.deleteById(id);
        ctx.logger.info(`删除author:${JSON.stringify(author)}`);
        return { success: true };
    }

    findById = (ctx) => {
        const id = parseInt(ctx.request.params.id);
        return ctx.authorDao.findById(id);
    }

    findByOrganizationId = (ctx) => {
        const organizationId = parseInt(ctx.request.params.organizationId);
        return ctx.authorDao.findByOrganizationId(organizationId);
    }

    findAll = (ctx) => {
        return ctx.authorDao.findAll();
    }
}
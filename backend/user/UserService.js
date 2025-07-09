import crypto from 'crypto';
import error from '../error.js';

export default class UserService {
    /**
     * 
     * @param {username}  用户名
     * @param {password}  密码
     * @returns 
     */
    insert = async (ctx) => {
        if (!ctx.userService.isAdmin(ctx.state.user)) {
            throw error.auth.Unauthorized;
        }
        const { username, password } = ctx.request.body;
        let user = ctx.userDao.findByUsername(username);
        if (!user) {
            // 新用户注册为普通用户
            const token = crypto.randomBytes(32).toString('hex');
            ctx.userDao.insert({ username, password, token, role: 'user' });
            return { token };
        }
        else {
            throw { code: 400, message: '用户名已存在' };
        }
    }

    /**
     * 
     * @param {role}  用户身份
     * @param {username}  用户名
     * @returns 
     */
    update = async (ctx) => {
        // 只有admin才可更新
        if (!ctx.userService.isAdmin(ctx.state.user)) {
            throw error.auth.Unauthorized;
        }
        const { role } = ctx.params;
        const { username } = ctx.request.body;
        if (!['admin', 'user'].includes(role)) {
            throw { code: 400, message: '角色只能是admin或user' };
        }
        ctx.userDao.updateRole(username, role);
        ctx.logger.info(`更新用户角色:${username} -> ${role}`);
        return { username: username, role };
    }

    /**
     * 
     * @param {username}  用户名
     * @param {password}  密码
     * @returns 
     */
    login = async (ctx) => {
        const { username, password } = ctx.request.body;
        let user = ctx.userDao.findByUsername(username);
        if (!user) {
            throw { code: 401, message: '用户名不存在' };
        }
        if (user.password !== password) {
            throw { code: 402, message: '用户名或密码错误' };
        }
        let token = user.token;
        if (!token) {
            token = crypto.randomBytes(32).toString('hex');
            ctx.userDao.updateToken(username, token);
        }
        return { token };
    }

    isAdmin = (user) => {
        return user && user.role === 'admin';
    }
}

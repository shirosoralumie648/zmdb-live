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

    /**
     * 用户注册
     * @param {username}  用户名
     * @param {password}  密码
     * @param {email}     邮箱（可选）
     * @returns 
     */
    register = async (ctx) => {
        const { username, password, email } = ctx.request.body;
        
        // 验证输入
        if (!username || !password) {
            throw { code: 400, message: '用户名和密码不能为空' };
        }
        
        if (username.length < 3) {
            throw { code: 400, message: '用户名至少需要3个字符' };
        }
        
        if (password.length < 6) {
            throw { code: 400, message: '密码至少需要6个字符' };
        }
        
        // 检查用户名是否已存在
        let existingUser = ctx.userDao.findByUsername(username);
        if (existingUser) {
            throw { code: 409, message: '用户名已存在' };
        }
        
        // 创建新用户
        const token = crypto.randomBytes(32).toString('hex');
        const userData = {
            username,
            password,
            token,
            role: 'user', // 新注册用户默认为普通用户
            email: email || null
        };
        
        try {
            ctx.userDao.insert(userData);
            ctx.logger.info(`新用户注册成功: ${username}`);
            return { 
                token,
                username,
                role: 'user',
                message: '注册成功'
            };
        } catch (error) {
            ctx.logger.error(`用户注册失败: ${error.message}`);
            throw { code: 500, message: '注册失败，请稍后重试' };
        }
    }

    isAdmin = (user) => {
        return user && user.role === 'admin';
    }
}

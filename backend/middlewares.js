import error from "./error.js";

export async function errorHandler(ctx, next) {
    try {
        await next();
    } catch (e) {
        ctx.logger.error(e);
        let ex = {};
        if (e.hasOwnProperty('code')) {
            ex.code = e.code;
        } else {
            ex.code = 500;
        }

        if (e.hasOwnProperty('message')) {
            ex.message = e.message;
        } else {
            ex.message = `${e}`;
        }
        ctx.body = ex;
        ctx.status = 400;
    }
}

export async function auth(ctx, next) {
    const token = ctx.header.authorization;
    if (!token || !token.startsWith('Bearer ')) {
        throw error.auth.Unauthorized;
    }
    const pureToken = token.replace('Bearer ', '');
    const user = ctx.userDao.findByToken(pureToken);
    if (!user) {
        throw error.auth.Unauthorized;
    }
    ctx.state.user = user;
    await next();
}
import config from "./config.js";
import error from "./error.js";
import AuthApi from './api/AuthApi.js';


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

// 新的用户验证函数，可以进行远程调用和透传，目前暂未实现
// export async function auth(ctx, next) {
//     const token = ctx.header.authorization;
//     ctx.logger.info(token);
//     const auth = await AuthApi.auth(token);
//     ctx.logger.info(auth);
//     await next();
// }

export async function auth(ctx, next) {
    const token = ctx.header.authorization;
    config.zimu.auths.forEach(auth => {
        if (`Bearer ${auth.secretKey}` === token) {
            ctx.state.auth = auth;
        }
    });
    if (!ctx.state.auth) {
        throw error.auth.Unauthorized;
    }
    await next();
}
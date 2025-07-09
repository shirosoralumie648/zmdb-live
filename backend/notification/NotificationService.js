import validation from "../validation.js";
import error from '../error.js';

export default class NotificationService {

    constructor() {
        this.content = '';
    }

    /**
     * 
     * @param {content} 通知内容
     * @returns 
     */
    insert = async (ctx) => {
        this.content = ctx.request.body.name;
        ctx.logger.info(`content: ${this.content}`);
        return {content: ctx.request.body.content};
    }
    
    find = (ctx) => {
        this.content = ctx.request.body.name;
        return {content: this.content};
    }
}
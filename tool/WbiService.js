import md5 from 'md5';
import config from "./config.js";

export default class WbiService {

    constructor() {
        this.key = '';
        this.updateTime = 0;
    }

    encode = async (ctx) => {
        ctx.logger.info(ctx.request.query);
        const now = Date.now();
        if (now - this.updateTime > 2 * 60 * 60 * 1000) {
            const navUrl = `${config.bili.api.url}/x/web-interface/nav`;
            const navRes = await fetch(navUrl);
            const navJson = await navRes.json();
            const imgUrl = navJson.data.wbi_img.img_url;
            const subUrl = navJson.data.wbi_img.sub_url;
            const imgKey = imgUrl.substring(imgUrl.lastIndexOf('/') + 1, imgUrl.length).split('.')[0];
            const subKey = subUrl.substring(subUrl.lastIndexOf('/') + 1, subUrl.length).split('.')[0];
            const rawKey = imgKey + subKey;
            ctx.logger.info(`imgUrl:${imgUrl}, subUrl:${subUrl}, rawKey:${rawKey}`);

            const mixinKeyEncTab = [
                46, 47, 18, 2, 53, 8, 23, 32, 15, 50, 10, 31, 58, 3, 45, 35, 27, 43, 5, 49,
                33, 9, 42, 19, 29, 28, 14, 39, 12, 38, 41, 13, 37, 48, 7, 16, 24, 55, 40,
                61, 26, 17, 0, 1, 60, 51, 30, 4, 22, 25, 54, 21, 56, 59, 6, 63, 57, 62, 11,
                36, 20, 34, 44, 52
            ];
    
            this.key = mixinKeyEncTab.map(item => rawKey[item]).join('').slice(0, 32);
            this.updateTime = now;
            ctx.logger.info(`update key:${this.key}, now:${now}`);
        }

        const wts = Math.round(now / 1000);
        const chr_filter = /[!'\(\)*]/g;
        let params = {...ctx.request.query, wts};
        // // 按照 key 重排参数
        const query = Object.keys(params).sort().map(k => `${encodeURIComponent(k)}=${encodeURIComponent(('' + params[k]).replace(chr_filter, ''))}`).join('&');
        const sign = md5(query + this.key) // 计算 w_rid
        return `${query}&w_rid=${sign}`;
    }
}
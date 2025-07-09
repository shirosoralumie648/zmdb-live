import fetch from 'node-fetch';
import { exec } from 'child_process';
import config from '../config.js';

export default class BiliApi {

    static async fetchCid(bv) {
        const res = await fetch(`${config.bili.api.url}/x/web-interface/view?bvid=${bv}`);
        const data = await res.json();
        return data.data.cid;
    }

    static async fetchStreamUrl(bv, cid) {
        const res = await new Promise((res, rej) => {
            const playurl = `${config.bili.api.url}/x/player/playurl?bvid=${bv}&cid=${cid}&qn=120&fnval=128&fourk=1`;
            const cmd = `curl '${playurl}' \
                -H 'authority: api.bilibili.com' \
                -H 'accept: application/json, text/javascript, */*; q=0.01' \
                -H 'accept-language: zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6' \
                -H 'cache-control: no-cache' \
                -H "cookie: ${config.bili.api.cookie}" \
                -H 'origin: https://player.bilibili.com' \
                -H 'pragma: no-cache' \
                -H 'referer: https://player.bilibili.com/' \
                -H 'sec-ch-ua: "Microsoft Edge";v="105", " Not;A Brand";v="99", "Chromium";v="105"' \
                -H 'sec-ch-ua-mobile: ?0' \
                -H 'sec-ch-ua-platform: "Windows"' \
                -H 'sec-fetch-dest: empty' \
                -H 'sec-fetch-mode: cors' \
                -H 'sec-fetch-site: same-site' \
                -H 'user-agent: ${config.segment.userAgent}' \
                --compressed`;
            exec(cmd, (error, stdout, stderr) => {
                if (error) {
                    rej(error);
                }
                res(JSON.parse(stdout));
            });
        });
        return res.data.durl[0].url;
    }

    static async fetchStreamUrls(bv, cid) {
        const res = await fetch(`https://api.bilibili.com/x/player/playurl?bvid=${bv}&cid=${cid}&qn=120&fnver=0&fnval=16&fourk=1`, {
            "headers": {
                "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                "accept-language": "en-US,en;q=0.9",
                "cache-control": "max-age=0",
                "sec-ch-ua": "\"Google Chrome\";v=\"111\", \"Not(A:Brand\";v=\"8\", \"Chromium\";v=\"111\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "document",
                "sec-fetch-mode": "navigate",
                "sec-fetch-site": "none",
                "sec-fetch-user": "?1",
                "upgrade-insecure-requests": "1",
                "cookie": config.bili.api.cookie
            },
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": null,
            "method": "GET"
        });
        return await res.json(); 
    }

    static async fetchVideoInfo(bvid) {
        const url = `${config.bili.api.url}/x/web-interface/view?bvid=${bvid}`;
        const res = await fetch(url, {
            headers: {
                "cookie" : config.bili.api.cookie
            }
        });
        return await res.json();
    }
}
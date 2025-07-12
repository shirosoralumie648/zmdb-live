import { stat, unlink } from 'fs/promises';
import config from './config.js';
import {
    fetchFrame, 
    segmentVideoFromUrl, 
    segmentVideoFromLocal, 
    segmentAudioFromUrl, 
    segmentAudioFromLocal,
    merge
} from './ffmpeg.js';
import { toSeconds } from './util.js';
import BiliApi from './api/BiliApi.js';
import PushApi from './api/PushApi.js';
import ZimuApi from './api/ZimuApi.js';

export default class SegmentService {

    constructor() {
    }

    make = async (ctx) => {
        const clipId    = parseInt(ctx.params.clipId);
        const startTime = ctx.request.query.startTime;
        const endTime   = ctx.request.query.endTime;
        const audio     = ctx.request.query.audio || 'false';

        const st = startTime.replace(',', '.');
        const et = endTime.replace(',', '.');

        const stSeconds = toSeconds(st);
        const etSeconds = toSeconds(et);
        ctx.logger.info(`stSeconds:${stSeconds},etSeconds:${etSeconds}`);

        let filename = `clip-${clipId}-${st.replaceAll(':', '-').replace('.', '-')}--${et.replaceAll(':', '-').replace('.', '-')}`;
        if (audio === 'true') {
            filename = `${filename}.aac`;
        } else {
            filename = `${filename}.mp4`;
        }
        const output = `${config.segment.path}/${filename}`;

        // 获取clip基础信息
        const clip = await ZimuApi.findClipById(clipId);
        ctx.logger.info(clip);

        // 如果存在相同的切片，则直接返回
        try {
            await stat(output);
            PushApi.push('切片已存在', `${clip.id},${clip.title},${filename}`);
            return { filename };
        } catch (ex) {}

        if (clip.type === 1) {
            // B站源
            // 获取bv和cid
            const bv = clip.playUrl.substring(clip.playUrl.length - 12);
            ctx.logger.info(`bv:${bv}`);
            const cid = (await BiliApi.fetchVideoInfo(bv)).data.cid;
            ctx.logger.info(`cid:${cid}`);
            const streamJson = await BiliApi.fetchStreamUrls(bv, cid);

            const videoUrl = streamJson.data.dash.video[0].baseUrl;
            const audioUrl = streamJson.data.dash.audio[0].baseUrl;
            ctx.logger.info(`video:${videoUrl}`);
            ctx.logger.info(`audio:${audioUrl}`);

            if (audio === 'true') {
                await segmentAudioFromUrl(audioUrl, output, stSeconds, etSeconds);
                await stat(output); // 检查音频是否生成成功
                ctx.logger.info(`音频(${output})生成成功`);

                PushApi.push('音频片段制作完成', `${clip.id},${clip.authorId},${clip.title},${filename}`);
                return {filename};
            }

            // 获取视频开始和结束最近的关键帧，也就是I帧
            let frameTasks = [];
            frameTasks.push(fetchFrame(videoUrl, stSeconds > 5 ? stSeconds - 5 : 0, stSeconds));
            frameTasks.push(fetchFrame(videoUrl, etSeconds, etSeconds + 5));
            const [stFrame, etFrame] = await Promise.all(frameTasks);
            ctx.logger.info(`startI:${stFrame}, endI:${etFrame}}`);

            // 生成以关键帧开头和结尾的粗视频
            const rawVideoPath = `${config.segment.path}/${filename}.raw.mp4`;
            await segmentVideoFromUrl(videoUrl, rawVideoPath, stFrame, etFrame);
            await stat(rawVideoPath); // 检查粗视频是否生成成功
            ctx.logger.info(`粗视频(${rawVideoPath})生成成功`);

            // 生成以关键帧开头和结尾的粗音频
            const rawAudioPath = `${config.segment.path}/${filename}.raw.aac`;
            await segmentAudioFromUrl(audioUrl, rawAudioPath, stFrame, etFrame);
            await stat(rawAudioPath); // 检查粗音频是否生成成功
            ctx.logger.info(`粗音频(${rawAudioPath})生成成功`);

            // 将粗视频和粗音频合并成新视频
            const mergeFilePath = `${config.segment.path}/${filename}.merge.mp4`;
            await merge(rawVideoPath, rawAudioPath, mergeFilePath);
            await stat(mergeFilePath); // 检查粗视频和粗音频是否合并成功
            ctx.logger.info(`合并视频(${mergeFilePath})生成成功`);

            // 从合并视频中提取出正确开头结尾的最终视频
            const stEx = stSeconds - stFrame;
            const etEx = (etSeconds - stSeconds) + stEx;
            ctx.logger.info(`提取开始位置:${stEx},提取结束位置:${etEx}`);
            await segmentVideoFromLocal(mergeFilePath, output, stEx, etEx);
            await stat(output); // 检查最终视频是否生成成功
            ctx.logger.info(`视频(${output})提取成功`);

            // 删除中间文件
            await unlink(rawVideoPath);
            await unlink(rawAudioPath);
            await unlink(mergeFilePath);

            PushApi.push('视频片段制作完成', `${clip.id},${clip.authorId},${clip.title},${filename}`);
            return {filename};
        } else if (clip.type === 3) {
            // 本地源
            let a = clip.playUrl.split('/');
            a[0] = config.zimu.url;
            const src = a.join('/');
            ctx.logger.info(`src:${src}`);

            if (audio === 'true') {
                await segmentAudioFromLocal(src, output, stSeconds, etSeconds);
            } else {
                await segmentVideoFromLocal(src, output, stSeconds, etSeconds);
            }
            await stat(output); // 检查视频是否生成成功
            ctx.logger.info(`片段(${output})生成成功`);
            PushApi.push('片段制作完成', `${clip.id},${clip.authorId},${clip.title},${filename}`);
            return {filename};
        } else if (clip.type === 4 || clip.type === 5) {
            // 本地直播和已下播
            let a = clip.playUrl.split('/');
            a[0] = config.zimu.url;
            const src = a.join('/');
            ctx.logger.info(`src:${src}`);

            if (audio === 'true') {
                await segmentAudioFromLocal(src, output, stSeconds, etSeconds);
            } else {
                await segmentVideoFromLocal(src, output, stSeconds, etSeconds);
            }
            await stat(output); // 检查视频是否生成成功
            ctx.logger.info(`片段(${output})生成成功`);
            PushApi.push('片段制作完成', `${clip.id},${clip.authorId},${clip.title},${filename}`);
            return {filename};
        }
        return {};
    }
}
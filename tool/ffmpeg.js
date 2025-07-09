import { spawn } from 'child_process';
import config from './config.js';

export const fetchFrame = async (videoUrl, startTime, endTime) => {
    const cmd = [
        '-i', videoUrl,
        '-read_intervals', `${startTime}%${endTime}`,
        '-show_frames',
        '-hide_banner',
        '-print_format', 'json',
        '-user_agent', config.segment.userAgent, 
        '-headers', `Referer: ${config.segment.referer}`,
    ];

    return await new Promise((res, rej) => {
        let p = spawn('ffprobe', cmd, { windowsHide:true });
        let content = '';
        p.stdout.on('data', (data) => {
            content += data;
        });
        p.stderr.on('data', (data) => {
            console.log('stderr: ' + data.toString());
        });
        p.on('close', (code) => {
            console.log(`帧分析结束, code:${code}`);
            let pos = 0;
            const frames = JSON.parse(content).frames;
            for (let i = 0; i < frames.length; ++i) {
                const frame = frames[i];
                if (frame.key_frame === 1) {
                    // console.log(frame);
                    // pos = parseFloat(frame.pkt_dts_time);
                    pos = parseFloat(frame.best_effort_timestamp_time);
                }
            }
            res(pos);
        });
        p.on('error', (error) => {
            ctx.logger.error(error);
            rej(error);
        });
    });
}

export const segmentVideoFromUrl = async (src, dst, start, end) => {
    const cmd = [
        '-y',
        '-ss', start, 
        '-accurate_seek', 
        '-seekable', 1, 
        '-user_agent', config.bili.api.userAgent, 
        '-headers', `Referer: ${config.bili.api.referer}`,
        '-i', src,
        '-t', end - start, 
        '-c', 'copy',
        dst
    ];
    await new Promise((res, rej) => {
        let p = spawn('ffmpeg', cmd, { windowsHide:true });
        p.stdout.on('data', (data) => {
            console.log('stdout: ' + data.toString());
        });
        p.stderr.on('data', (data) => {
            console.log('stderr: ' + data.toString());
        });
        p.on('close', (code) => {
            console.log(`视频切片生成结束:code:${code}`);
            res();
        });
        p.on('error', (error) => {
            rej(error);
        });
    });
}

export const segmentVideoFromLocal = async (src, dst, start, end) => {
    const cmd = [
        '-y',
        '-ss', start, 
        '-accurate_seek', 
        '-i', src,
        '-t', end - start, 
        '-c', 'copy',
        '-avoid_negative_ts', 1,
        dst
    ];
    await new Promise((res, rej) => {
        let p = spawn('ffmpeg', cmd, { windowsHide:true });
        p.stdout.on('data', (data) => {
            console.log('stdout: ' + data.toString());
        });
        p.stderr.on('data', (data) => {
            console.log('stderr: ' + data.toString());
        });
        p.on('close', (code) => {
            console.log(`视频切片生成结束:code:${code}`);
            res();
        });
        p.on('error', (error) => {
            rej(error);
        });
    });
}

export const segmentAudioFromUrl = async (src, dst, start, end) => {
    const cmd = [
        '-y',
        '-ss', start, 
        '-user_agent', config.bili.api.userAgent, 
        '-headers', `Referer: ${config.bili.api.referer}`,
        '-i', src,
        '-t', end - start, 
        '-vn',
        '-c', 'copy',
        dst
    ];
    await new Promise((res, rej) => {
        let p = spawn('ffmpeg', cmd, { windowsHide:true });
        p.stdout.on('data', (data) => {
            console.log('stdout: ' + data.toString());
        });
        p.stderr.on('data', (data) => {
            console.log('stderr: ' + data.toString());
        });
        p.on('close', (code) => {
            console.log(`音频切片生成结束:code:${code}`);
            res();
        });
        p.on('error', (error) => {
            rej(error);
        });
    });
}

export const segmentAudioFromLocal = async (src, dst, start, end) => {
    const cmd = [
        '-y',
        '-ss', start, 
        '-accurate_seek', 
        '-i', src,
        '-t', end - start, 
        '-vn',
        '-c', 'copy',
        // '-avoid_negative_ts', 1,
        dst
    ];
    await new Promise((res, rej) => {
        let p = spawn('ffmpeg', cmd, { windowsHide:true });
        p.stdout.on('data', (data) => {
            console.log('stdout: ' + data.toString());
        });
        p.stderr.on('data', (data) => {
            console.log('stderr: ' + data.toString());
        });
        p.on('close', (code) => {
            console.log(`音频切片生成结束:code:${code}`);
            res();
        });
        p.on('error', (error) => {
            rej(error);
        });
    });
}

export const merge = async (videoSrc, audioSrc, dst) => {
    const cmd = [
        '-y',
        '-i', videoSrc,
        '-i', audioSrc,
        '-c:v', 'copy',
        '-c:a', 'copy',
        // '-reset_timestamps', 1,
        // '-avoid_negative_ts', 1,
        dst
    ];

    await new Promise((res, rej) => {
        let p = spawn('ffmpeg', cmd, { windowsHide:true });
        p.stdout.on('data', (data) => {
            console.log('stdout: ' + data.toString());
        });
        p.stderr.on('data', (data) => {
            console.log('stderr: ' + data.toString());
        });
        p.on('close', (code) => {
            console.log(`混合结束, code:${code}`);
            res();
        });
        p.on('error', (error) => {
            ctx.logger.error(error);
            rej(error);
        });
    });
}

export const toAudio = async (videoUrl, filepath) => {
    const cmd = [
        '-y',
        '-user_agent', config.segment.userAgent, 
        '-headers', `Referer: ${config.segment.referer}`,
        '-i', videoUrl,
        '-vn', 
        '-codec', 'copy',
        filepath
    ];
    await new Promise((res, rej) => {
        let p = spawn('ffmpeg', cmd, { windowsHide:true });
        p.stdout.on('data', (data) => {
            console.log('stdout: ' + data.toString());
        });
        p.stderr.on('data', (data) => {
            console.log('stderr: ' + data.toString());
        });
        p.on('close', (code) => {
            console.log(`ffmpeg退出:code:${code}`);
            res();
        });
        p.on('error', (error) => {
            rej(error);
        });
    });
}

export const segment = async (src, dst, start, end) => {
    const cmd = [
        '-y',
        '-ss', start, 
        '-to', end,
        '-i', src,
        '-c', 'copy',
        dst
    ];
    await new Promise((res, rej) => {
        let p = spawn('ffmpeg', cmd, { windowsHide:true });
        p.stdout.on('data', (data) => {
            console.log('stdout: ' + data.toString());
        });
        p.stderr.on('data', (data) => {
            console.log('stderr: ' + data.toString());
        });
        p.on('close', (code) => {
            console.log(`ffmpeg退出:code:${code}`);
            res();
        });
        p.on('error', (error) => {
            rej(error);
        });
    });
}
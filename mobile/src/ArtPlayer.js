import { useEffect, useRef } from 'react';
import Artplayer from 'artplayer';
import artplayerPluginDanmuku from 'artplayer-plugin-danmuku';
import flvjs from 'flv.js';

export default function Player({ option, getInstance, ...rest }) {
    const artRef = useRef();

    useEffect(() => {
        const art = new Artplayer({
            ...option,
            container: artRef.current,
            isLive: false,
            setting: true,
            fullscreen: true,
            screenshot: true,
            fastForward: true,
            playbackRate: true,
            miniProgressBar: true,
            autoOrientation: true,
            whitelist: ['*'],
            moreVideoAttr: {
                crossOrigin: 'anonymous',
                'x5-video-player-type': 'h5',
                'x5-video-player-fullscreen': false,
                'x5-video-orientation': 'portraint',
                preload: "auto"
            },
            customType: {
                flv: function (video, url) {
                    if (flvjs.isSupported()) {
                        const flvPlayer = flvjs.createPlayer({
                            type: 'flv',
                            url: url,
                        });
                        flvPlayer.attachMediaElement(video);
                        flvPlayer.load();
                    } else {
                        art.notice.show = '不支持播放flv';
                    }
                },
            },
            plugins: [
                artplayerPluginDanmuku({
                    antiOverlap: true,
                    fontSize: 16,
                    speed: 8,
                    minWidth:0,
                    // 弹幕 XML 文件，和 Bilibili 网站的弹幕格式一致
                    danmuku: option.danmakuUrl,
                }),
            ],
        });

        art.on('ready', () => {
            console.log('artplayer is ready!');
            // art.play();
        })

        if (getInstance && typeof getInstance === 'function') {
            getInstance(art);
        }

        return () => {
            if (art && art.destroy) {
                art.destroy(false);
            }
        };
    }, []);

    return <div ref={artRef} {...rest}></div>;
}
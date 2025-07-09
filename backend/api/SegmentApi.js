import axios from 'axios';
import config from '../config.js';

export default class SegmentApi {
    
    static segment = async (clipId, startTime, endTime, segmentName, audio, danmaku, forward) => {
        const url = `${config.zimu.cut.url}/clips/${clipId}/segments?startTime=${startTime}&endTime=${endTime}&segmentName=${segmentName || ''}&audio=${audio}&danmaku=${danmaku}&forward=${forward}`;
        return (await axios.get(url)).data;
    }
}
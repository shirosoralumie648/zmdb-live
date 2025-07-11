export default {
    db: {
        path: '../db/zmdb.db' , // 数据库文件路径
    },
    web: {
        port: 4000, // 后端服务端口
        bodyLimit: 10 * 1024 // 请求体限制，单位为字节
    },
    zimu: {
        local: {
            url: '//localhost:4000/records', // 本地视频源目录
        },
        live: {
            url: '//localhost:4000/lives' // 直播源目录
        },
        cut: {
            url: 'http://localhost:5000' // 剪辑工具 API 的 URL (http/https 不能省略)
        },
    },
}
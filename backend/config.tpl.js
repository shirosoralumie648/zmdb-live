export default {
    db: {
        path: '../db/zmdb.db',
        options: {      
            verbose: console.log,
            fileMustExist: true // 确保数据库文件存在
        }
    },
    zimu: {
        auths: [
            { secretKey: 'abc123', role: 'admin' },
            { secretKey: 'def456', role: 'guest' }
        ]
    },
    web: {
        port: 5000,
        bodyLimit: 10 * 1024
    },
}
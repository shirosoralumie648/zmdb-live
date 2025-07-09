export default class UserDao {
    constructor(db) {
        this.db = db;
        this.__init();
    }

    __init = () => {
        const sql = `CREATE TABLE IF NOT EXISTS user (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            token TEXT UNIQUE,
            role TEXT DEFAULT 'user'
        )`;
        this.db.exec(sql);
        // 检查并补充 role 字段
        const columns = this.db.prepare("PRAGMA table_info(user)").all();
        if (!columns.find(col => col.name === 'role')) {
            this.db.exec("ALTER TABLE user ADD COLUMN role TEXT DEFAULT 'user'");
        }
    }

    findByUsername = (username) => {
        const sql = 'SELECT * FROM user WHERE username = ?';
        return this.db.prepare(sql).get(username);
    }

    findByToken = (token) => {
        const sql = 'SELECT * FROM user WHERE token = ?';
        return this.db.prepare(sql).get(token);
    }

    insert = (user) => {
        const sql = 'INSERT INTO user(username, password, token, role) VALUES(@username, @password, @token, @role)';
        return this.db.prepare(sql).run(user);
    }

    updateToken = (username, token) => {
        const sql = 'UPDATE user SET token = ? WHERE username = ?';
        return this.db.prepare(sql).run(token, username);
    }

    updateRole = (username, role) => {
        const sql = 'UPDATE user SET role = ? WHERE username = ?';
        return this.db.prepare(sql).run(role, username);
    }
}

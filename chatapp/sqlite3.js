import sqlite3 from 'sqlite3';

let db;
export class DBCommon {
    static init() {
        db = new sqlite3.Database('posts.db');
    }
    static get() {
        return db;
    }
}

export default class PostTable {
    static async createTableIfNotExists() {
        const db = DBCommon.get();
        return new Promise((resolve, reject) => {
            try {
                db.serialize(() => {
                    db.run(
                        `create table if not exists posts(
                            id         integer primary key autoincrement,
                            time       text    not null default(datetime('now','localtime')),
                            chat       text
                        )`
                    );
                })
                return resolve();
            } catch (err) {
                return reject(err);
            }
        });
    }
    static async insert(data) {
        const db = DBCommon.get();
        return new Promise((resolve, reject) => {
            try {
                db.run("insert into posts(chat) values(?)", data);
                return resolve();
            } catch (err) {
                return reject(err);
            }
        });
    }

    /**
    * @return Promise(全レコードのArray)
    */
    static async selectAll() {
        return this.select();
    }

    /**
     * @param date: string YYYY-MM-DD形式の年月日文字列
     * @return Promise(該当レコードのArray)
     */
    static async selectByDate(date) {
        return this.select([`datetime(time) between datetime('${date} 00:00:00') and datetime(${date} 23:59:59')`])
    }

    /**
     * @param conditions: Array where句に続くクエリ列
     * @return Promise(該当レコードのArray)
     */
    static async select(conditions = []) {
        const db = DBCommon.get();
        let query = "select * from posts";
        // 条件がある場合where句で指定する
        if (conditions.length > 0) {
            // 複数条件はandで結合
            const whereClause = conditions.join(" and ")
            query += ` where ${whereClause}`
        }
        return new Promise((resolve, reject) => {
            db.serialize(() => {
                db.all(query, (err, rows) => {
                    if (err) return reject(err);
                    return resolve(JSON.stringify(rows));
                })
            })
        })
    }
}

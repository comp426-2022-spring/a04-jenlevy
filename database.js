//sqlite 3 but the not vulnerable version
const Database = require("better-sqlite3")

//creating new database 'logdb'
const db = new Database("logdb")


const stmt = db.prepare(`SELECT name FROM sqlite_master WHERE type='table' and name='accesslog';`);
let row = stmt.get()

if(row === undefined){
    console.log('Your database appears to be empty. I will initialize it now.')
    const sqlInit = `
    CREATE TABLE accesslog ( id INTEGER PRIMARY KEY, remoteaddr TEXT, remoteuser TEXT, time TEXT, method TEXT, url TEXT, protocol TEXT, httpversion TEXT, secure TEXT, status TEXT, referer TEXT, useragent TEXT);
    `
    db.exec(sqlInit);
    console.log('Your database has been initialized with a new table')

} else {
    console.log('Log database exists')
}


module.exports = db
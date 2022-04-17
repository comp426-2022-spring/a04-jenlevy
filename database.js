//sqlite 3 but the not vulnerable version
const database = require("better-sqlite3")

//creating new database 'logdb'
const logdb = new database("logdb")


const stmt = logdb.prepare(`
    SELECT name FROM sqlite_master WHERE type='table' and name='userinfo';`
    );
let row = stmt.get()

if(row === undefined){
    console.log('Your database appears to be empty. I will initialize it now.')
    const sqlInit = `
        CREATE TABLE userinfo ( id INTEGER PRIMARY KEY, username TEXT, password TEXT );
        INSERT INTO userinfo (username, password) VALUES ('user1','supersecurepassword'),('test','anotherpassword');
    `;
    logdb.exec(sqlInit);
    console.log('Your database has been initialized with a new table and two entries containing a username and password.');

} else {
    console.log('Log database exists')
}


module.exports = logdb
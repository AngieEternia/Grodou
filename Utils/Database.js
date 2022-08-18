const Logger = require(`./Logger`);

const mysql = require(`mysql`)
const Database = new mysql.createConnection({
    host: `localhost`,
    user: `root`,
    password: ``,
    database: `grodou2`
})

Database.connect(function (err) {
    console.log("----------------------------------------------------");
    if (err) Logger.error(err);
    Logger.client(` —  Base de données connectée`)
})

module.exports = Database;
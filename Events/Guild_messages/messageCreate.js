const prefix = 't!';

module.exports = {
    name: 'messageCreate',
    once: false,
    execute(client, message) {
        if (message.author.bot) return;

        const db = client.db;

        db.query(`SELECT * FROM serveur WHERE guildID = ${message.guild.id}`, async (err, req) => {
            if (req.length < 1) {
                let sql = `INSERT INTO serveur (guildID, prefix, troll, purcent_troll, raid) VALUES (${message.guild.id}, '${prefix}', 'off', '20', 'off')`
                db.query(sql, function (err) {
                    if (err) throw err;
                })
                return message.reply(`Deux secondes coco, j'enregistre le serveur dans ma base de données !`)
            }
        });

    }
}
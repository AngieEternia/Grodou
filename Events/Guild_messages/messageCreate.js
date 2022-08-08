const prefix = 't!';

module.exports = {
    name: 'messageCreate',
    once: false,
    execute(client, message) {
        if (message.author.bot) return;

        //On ne veut pas que Grodou pète un câble et se réponde à lui-même en boucle...
        const db = client.db;


        db.query(`SELECT * FROM serveur WHERE guildID = ${message.guild.id}`, async (err, reqServ) => {
            // Enregistrement du serveur
            if (reqServ.length < 1) {
                let sql = `INSERT INTO serveur (guildID, prefix, troll, purcent_troll, raid) VALUES (${message.guild.id}, '${prefix}', 'off', '20', 'off')`
                db.query(sql, function (err) {
                    if (err) throw err;
                })
                return message.reply(`Deux secondes coco, j'enregistre le serveur dans ma base de données !`)
            }

            // Insertion des données dans la table user de la base de données
            db.query(`SELECT * FROM user WHERE userID = ${message.author.id} AND guildID = ${message.guild.id}`, async (err, req) => {
                
                // S'il n'y a pas de ligne pour l'utilisateur
                if (req.length < 1) {

                    let sql = `INSERT INTO user (guildID, userID, xp, level, messages) VALUES ('${message.guild.id}', '${message.author.id}', 0, 0, 1)`
                    db.query(sql, function (err) {
                        if (err) throw err;
                    })
                    // S'il y a déjà la ligne...
                } else {
                    /****************************************************
                    *********** Gestion du nombre de messages ***********
                    ****************************************************/

                    let numberMessages = req[0].messages
                    db.query(`UPDATE user SET messages = '${numberMessages + 1}' WHERE userID = ${message.author.id} AND guildID = ${message.guild.id}`)

                    /****************************************************
                    ************** Gestion de l'expérience **************
                    ****************************************************/
                    if (!message.content.startsWith(prefix)) {

                        let xp = Math.floor(Math.random() * 19) + 1;
                        let need = (parseInt(req[0].level) + 1) * 1000;

                        db.query(`UPDATE user SET xp = '${parseInt(req[0].xp) + xp}' WHERE userID = ${message.author.id} AND guildID = ${message.guild.id}`)

                        if (parseInt(req[0].xp) >= need) {

                            db.query(`UPDATE user SET level = '${parseInt(req[0].level) + 1}' WHERE userID = ${message.author.id} AND guildID = ${message.guild.id}`)
                            db.query(`UPDATE user SET xp = '${parseInt(req[0].xp) - need}' WHERE userID = ${message.author.id} AND guildID = ${message.guild.id}`)

                            message.channel.send(`Tadadadaaa ! ${message.author}, tu montes au niveau \`${parseInt(req[0].level) + 1}\` !`)
                        }

                        if (parseInt(req[0].xp) < 0) {

                            db.query(`UPDATE user SET level = '${parseInt(req[0].level) - 1}' WHERE userID = ${message.author.id} AND guildID = ${message.guild.id}`)
                            db.query(`UPDATE user SET xp = '${(parseInt(req[0].level) * 1000) + parseInt(req[0].xp)}' WHERE userID = ${message.author.id} AND guildID = ${message.guild.id}`)

                            message.channel.send(`Oh non ! ${message.author}, tu es redescendu au niveau \`${parseInt(req[0].level) - 1}\`...`)
                        }
                    }

                }
            })
        });

    }
}
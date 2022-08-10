const { EmbedBuilder } = require('discord.js')

module.exports = {
    name: 'messageUpdate',
    once: false,
    execute(client, oldMessage, newMessage) {
        const db = client.db;

        db.query(`SELECT * FROM config WHERE guildID = ${oldMessage.guild.id}`, async (err, conf) => {
            if (conf.length < 1) {
                let sql = `INSERT INTO config (guildID, messageUpdate, messageDelete) VALUES (${oldMessage.guild.id}, 'off', 'off')`;
                db.query(sql, function (err) {
                    if (err) throw err;
                })
            } 
            else {
                if (conf[0].messageUpdate === "off") return;
                else {
                    if (oldMessage.author.bot) return;

                    if (oldMessage.content === newMessage.content) return;
                    else {
                        let embed = new EmbedBuilder()
                            .setColor(client.color)
                            .setAuthor({
                                name: `Message modifié`,
                                iconURL: "https://cdn.discordapp.com/emojis/1006558257248215090.png",
                            })
                            .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                            .setDescription(`◽️ **Auteur du message :** ${oldMessage.author}\n◽️ **Création du message :** <t:${Math.floor(oldMessage.createdAt / 1000)}:F>\n◽️ **Salon du message :** <#${oldMessage.channelId}>\n◽️ **Ancien contenu :** \`\`\`${oldMessage.content}\`\`\`◽️ **Nouveau contenu :** \`\`\`${newMessage.content}\`\`\``)

                        db.query(`SELECT * FROM logs WHERE type = 'other' AND guildID = ${oldMessage.guild.id}`, async (err, req) => {
                            if (req.length < 1) return
                            else {
                                let channelLog = client.channels.cache.get(req[0].channelID)
                                await channelLog.send({ embeds: [embed] })
                            }
                        })
                    }
                }
            }
        })
    }
}
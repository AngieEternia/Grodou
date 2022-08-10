const { EmbedBuilder } = require('discord.js')

module.exports = {
    name: 'messageDelete',
    once: false,
    async execute(client, message) {
        if(client.snipe.get(message.channel.id)) await client.snipe.delete(message.channel.id) && await client.snipe.set(message.channel.id, message)
        else await client.snipe.set(message.channel.id, message);

        const db = client.db;

        db.query(`SELECT * FROM config WHERE guildID = ${message.guild.id}`, async (err, conf) => {
            if (conf.length < 1) {
                let sql = `INSERT INTO config (guildID, messageUpdate, messageDelete) VALUES (${message.guild.id}, 'off', 'off')`;
                db.query(sql, function (err) {
                    if (err) throw err;
                })
            }
            else {
                if (conf[0].messageDelete === "off") return;
                else {
                    if (message.author.bot) return;

                    let embed = new EmbedBuilder()
                        .setColor(client.color)
                        .setAuthor({
                            name: `Message supprimé`,
                            iconURL: "https://cdn.discordapp.com/emojis/1006560422775763007.png",
                        })
                        .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                        .setDescription(`◽️ **Auteur du message :** ${message.author}\n◽️ **Création du message :** <t:${Math.floor(message.createdAt / 1000)}:F>\n◽️ **Contenu :** ${message.content === "" ? "" : `\`\`\`${message.content}\`\`\``}`)
                        .setImage(message.attachments?.first()?.proxyURL)

                    db.query(`SELECT * FROM logs WHERE type = 'other' AND guildID = ${message.guild.id}`, async (err, req) => {
                        if (req.length < 1) return
                        else {
                            let channelLog = client.channels.cache.get(req[0].channelID)
                            await channelLog.send({ embeds: [embed] })
                        }
                    })

                }
            }
        })
    }
}
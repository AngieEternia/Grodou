const { EmbedBuilder } = require('discord.js')

module.exports = {
    name: 'threadCreate',
    once: false,
    async execute(client, thread, newlyCreated) {

        if (thread.isTextBased()) thread.join();

        const db = client.db;
        const embed = new EmbedBuilder()
            .setColor("#41b8e4")
            .setAuthor({
                name: `Création d'un fil`,
                iconURL: "https://cdn.discordapp.com/emojis/1004621212812595260.png",
            })
            .setDescription(`◽️ **Accès au fil :** <#${thread.id}>\n◽️ **Nom du fil :** \`\`\`${thread.name}\`\`\``)
            .setTimestamp()

        db.query(`SELECT * FROM config WHERE type = 'logs' AND guildID = ${thread.guild.id}`, async (err, req) => {

            if (req.length < 1) return;
            else {
                const logChannel = client.channels.cache.get(req[0].channelID);
                logChannel.send({ embeds: [embed] });
            }
        })

    }
}
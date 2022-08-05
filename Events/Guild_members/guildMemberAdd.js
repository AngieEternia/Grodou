const { EmbedBuilder } = require('discord.js')

module.exports = {
    name: 'guildMemberAdd',
    once: false,
    async execute(client, member) {

        const db = client.db;
        const embed = new EmbedBuilder()
            .setAuthor({
                name: `${member.user.tag} (id : ${member.id})`,
                iconURL: member.user.displayAvatarURL(),
            })
            .setColor("#21ff81")
            .setDescription(
                `◽️ **Nom d'utilisateur :** ${member}\n◽️ **Créé le :** <t:${parseInt(member.user.createdTimestamp / 1000)}:f> (<t:${parseInt(member.user.createdTimestamp / 1000)}:R>)\n◽️ **Rejoint le :** <t:${parseInt(member.joinedTimestamp / 1000)}:f> (<t:${parseInt(member.joinedTimestamp / 1000)}:R>)`
            )
            .setTimestamp()
            .setFooter({ text: `L'utilisateur a rejoint ${member.guild.name} !` });

        db.query(`SELECT * FROM config WHERE type = 'logs' AND guildID = ${member.guild.id}`, async (err, req) => {

            if (req.length < 1) return;
            else {
                const logChannel = client.channels.cache.get(req[0].channelID);
                logChannel.send({ embeds: [embed] });
            }
        })

    }
}
const { EmbedBuilder } = require('discord.js')

module.exports = {
    name: 'guildMemberRemove',
    once: false,
    async execute(client, member) {
        const db = client.db;

        const fetchKickLog = await member.guild.fetchAuditLogs({
            limit: 1,
            type: 20
        });
        const kickLog = fetchKickLog.entries.first();
        const targetKick = kickLog.target;
        let isMemberKick = false;
        if (targetKick.id === member.id) isMemberKick = true;

        const fetchBanLog = await member.guild.fetchAuditLogs({
            limit: 1,
            type: 22
        });
        const banLog = fetchBanLog.entries.first();
        const targetBan = banLog.target;
        let isMemberBan = false;
        if (targetBan.id === member.id) isMemberBan = true;

        const embed = new EmbedBuilder()
            .setAuthor({
                name: `${member.user.tag} (id : ${member.id})`,
                iconURL: member.user.displayAvatarURL(),
            })
            .setColor("#dc143c")
            .setDescription(
                `◽️ **Nom d'utilisateur :** ${member}\n◽️ **Créé le :** <t:${parseInt(member.user.createdTimestamp / 1000)}:f> (<t:${parseInt(member.user.createdTimestamp / 1000)}:R>)\n◽️ **Rejoint le :** <t:${parseInt(member.joinedTimestamp / 1000)}:f> (<t:${parseInt(member.joinedTimestamp / 1000)}:R>)\n◽️ **Quitté le :** <t:${parseInt(Date.now() / 1000)}:f> (<t:${parseInt(Date.now() / 1000)}:R>)\n`
            )
            .setTimestamp()
            .setFooter({ text: `👋 L'utilisateur a quitté ${member.guild.name}` });

        db.query(`SELECT * FROM logs WHERE type = 'members' AND guildID = ${member.guild.id}`, async (err, req) => {
            if (req.length < 1) return;
            else {
                const logChannel = client.channels.cache.get(req[0].channelID);
                logChannel.send({ embeds: [embed] });
            }
        })

    }
}
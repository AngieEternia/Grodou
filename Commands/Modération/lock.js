module.exports = {
    name: 'lock',
    category: "Modération",
    permissions: ['MANAGE_CHANNELS'],
    ownerOnly: false,
    usage: 'lock <#channel> <reason>',
    examples: ['lock #nomDuSalon ceci_est_une_raison'],
    description: "Je verrouille un salon quand ça devient nécessaire !",
    options: [
        {
            name: 'salon',
            description: 'Le salon à verrouiller',
            type: 'CHANNEL',
            channelTypes: ["GUILD_TEXT"],
            required: false
        },
        {
            name: 'role',
            description: 'Le rôle à restreindre',
            type: 'ROLE',
            required: false
        },
        {
            name: 'raison',
            description: 'La raison du verrouillage',
            type: 'STRING',
            required: false
        }
    ],
    async runInteraction(client, interaction) {
        let reason = interaction.options.getString('raison');
        if (!reason) reason = "Aucune raison donnée";
        let channelTarget = interaction.options.getChannel('salon');
        if (!channelTarget) channelTarget = interaction.channel;
        let role = interaction.options.getRole('role');
        if (!role) role = interaction.guild;

        await channelTarget.permissionOverwrites.edit(role.id, { SEND_MESSAGES: false });

        await interaction.reply({ content: `Le salon <#${channelTarget.id}> a été verrouillé avec succès ! \`${reason}\``, ephemeral: true })
        await channelTarget.send(`**⚠️ ${interaction.user} vient de verrouiller ce salon ${role.id !== interaction.guild.id ? `pour le rôle <@&${role.id}>` : ''} : vous ne pouvez plus y poster de messages.\n🪧 Raison : 🙶 \`${reason}\` 🙸**`)
    }
}
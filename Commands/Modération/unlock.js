const { ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: 'unlock',
    category: "Modération",
    permissions: ['MANAGE_CHANNELS'],
    ownerOnly: false,
    usage: 'unlock <#channel> <reason>',
    examples: ['unlock #nomDuSalon ceci_est_une_raison'],
    description: "Je déverrouille un salon qui a été verrouillé !",
    options: [
        {
            name: 'salon',
            description: 'Le salon à verrouiller',
            type: ApplicationCommandOptionType.Channel,
            channelTypes: [0],
            required: false
        },
        {
            name: 'role',
            description: 'Le rôle à restreindre',
            type: ApplicationCommandOptionType.Role,
            required: false
        },
        {
            name: 'raison',
            description: 'La raison du verrouillage',
            type: ApplicationCommandOptionType.String,
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

        await channelTarget.permissionOverwrites.edit(role.id, { SendMessages: true });

        await interaction.reply({ content: `Le salon <#${channelTarget.id}> a été déverrouillé avec succès ! \`${reason}\``, ephemeral: true })
        await channelTarget.send(`**✅ ${interaction.user} vient de déverrouiller ce salon ${role.id !== interaction.guild.id ? `pour le rôle <@&${role.id}>` : ''} : vous pouvez de nouveau y poster des messages !\n🪧 Raison : 🙶 \`${reason}\` 🙸**`)
    }
}
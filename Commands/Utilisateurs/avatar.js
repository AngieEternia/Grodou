const { ApplicationCommandType, EmbedBuilder, PermissionFlagsBits } = require('discord.js')
const ms = require(`ms`)

module.exports = {
    name: 'avatar',
    category: "Utilisateurs",
    permissions: ['SendMessages'],
    defaultMemberPermissions: PermissionFlagsBits.SendMessages,
    ownerOnly: false,
    usage: 'Utiliser le menu contextuel de Discord',
    examples: ['Clic-droit sur un utilisateur'],
    type: ApplicationCommandType.User,
    async runInteraction(client, interaction) {
        const member = await interaction.guild.members.fetch(interaction.targetId)

        const embed = new EmbedBuilder()
            .setTitle(`Voici l'avatar de ${member.user.username} !`)
            .setColor(client.color)
            .setImage(member.user.displayAvatarURL({ dynamic: true, size: 4096, format: 'png' }))

        interaction.reply({ embeds: [embed] })
    }
}
const { MessageActionRow, MessageButton } = require('discord.js')

const buttons = new MessageActionRow()
    .addComponents(
        new MessageButton()
            .setCustomId('primary-button')
            .setLabel('Primary')
            .setStyle('PRIMARY'),

        new MessageButton()
            .setCustomId('secondary-button')
            .setLabel('Secondary')
            .setStyle('SECONDARY'),

        new MessageButton()
            .setCustomId('success-button')
            .setLabel('Success')
            .setStyle('SUCCESS'),

        new MessageButton()
            .setCustomId('danger-button')
            .setLabel('Danger')
            .setStyle('DANGER'),

        new MessageButton()
            .setURL('http://discordapp.com')
            .setLabel('Link')
            .setStyle('LINK'),
    )

module.exports = {
    name: 'button',
    category: "Informations",
    permissions: ['SEND_MESSAGES'],
    ownerOnly: false,
    usage: 'button',
    examples: ['button'],
    description: "Je te montre les différents types de boutons qui existent sur Discord !",
    async runInteraction(client, interaction) {
        await interaction.reply({ content: "Cliquez sur les boutons pour découvrir ce qu'ils font...", components: [buttons] })
    }
}
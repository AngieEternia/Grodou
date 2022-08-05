const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')

const buttons = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
            .setCustomId('primary-button')
            .setLabel('Primary')
            .setStyle(ButtonStyle.Primary),

        new ButtonBuilder()
            .setCustomId('secondary-button')
            .setLabel('Secondary')
            .setStyle(ButtonStyle.Secondary),

        new ButtonBuilder()
            .setCustomId('success-button')
            .setLabel('Success')
            .setStyle(ButtonStyle.Success),

        new ButtonBuilder()
            .setCustomId('danger-button')
            .setLabel('Danger')
            .setStyle(ButtonStyle.Danger),

        new ButtonBuilder()
            .setURL('http://discordapp.com')
            .setLabel('Link')
            .setStyle(ButtonStyle.Link),
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
const { EmbedBuilder } = require("discord.js")

module.exports = {
    name: 'test',
    category: "Informations",
    permissions: ['SEND_MESSAGES'],
    ownerOnly: false,
    usage: 'test',
    examples: ['test'],
    description: "Ceci est un test",

    runInteraction(client, interaction) {
        const embed = new EmbedBuilder()
            .setColor(client.color)
            .setDescription("ceci est un test")

        interaction.reply({ embeds: [embed] })
    }
}
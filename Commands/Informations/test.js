const { EmbedBuilder } = require("discord.js")

module.exports = {
    name: 'test',
    category: "Informations",
    permissions: ['SEND_MESSAGES'],
    ownerOnly: false,
    usage: 'test',
    examples: ['test'],
    description: "Ceci est un test",

    async runInteraction(client, interaction) {
        const embed = new EmbedBuilder()
            .setColor(client.color)
            .setDescription("ceci est un test")

            await interaction.client.application.fetch();
            console.log(client.application)
        interaction.reply({ content:`${client.application.owner}` })
    }
}
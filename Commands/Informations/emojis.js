const { EmbedBuilder } = require('discord.js')

module.exports = {
    name: 'emojis',
    category: "Informations",
    permissions: ['SEND_MESSAGES'],
    ownerOnly: false,
    usage: 'emojis',
    examples: ['emojis'],
    description: "Permet de poster vos emojis !",
    async runInteraction(client, interaction) {
        // 🟥🟩🟦
        const poll = await interaction.reply({ content: "Emojis", fetchReply: true })
        await poll.react('🟥');
        await poll.react('🟩');
        await poll.react('🟦');
    }
}
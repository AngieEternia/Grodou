module.exports = {
    name: 'primary-button', // le customId du bouton
    async runInteraction(client, interaction) {
        await interaction.reply({ content : 'je suis le bouton primary'})
     }
}
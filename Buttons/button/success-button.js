module.exports = {
    name: 'success-button', // le customId du bouton
    async runInteraction(client, interaction) {
        await interaction.reply({ content : 'je suis le bouton success'})
     }
}
module.exports = {
    name: 'secondary-button', // le customId du bouton
    async runInteraction(client, interaction) {
        await interaction.reply({ content : 'je suis le bouton secondary'})
     }
}
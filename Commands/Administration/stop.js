module.exports = {
    name: 'stop',
    category: "Administration",
    permissions: ['ADMINISTRATOR'],
    ownerOnly: true,
    usage: 'stop',
    examples: ['stop'],
    description: "Je stoppe mon programme et je pars faire une sieste !",
    async runInteraction(client, interaction) {
        await interaction.reply(`Très bien ${interaction.user}, j'arrête tout et je pars faire la sieste !`);
        require("child_process").execSync("pm2 stop Grodou");
    }
}
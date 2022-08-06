module.exports = {
    name: 'restart',
    category: "Administration",
    permissions: ['ADMINISTRATOR'],
    ownerOnly: true,
    usage: 'restart',
    examples: ['restart'],
    description: "Je redémarre mon programme quand il y a besoin !",
    async runInteraction(client, interaction) {
        // const devGuild = await client.guilds.cache.get('968232923323064340');
        // devGuild.commands.set([]);
        await interaction.reply(`C'est bon ${interaction.user}, mon cerveau a redémarré !`)
        return process.exit();
    }
}
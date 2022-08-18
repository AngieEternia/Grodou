const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'kickbot',
    category: "Administration",
    permissions: ['Administrator'],
    defaultMemberPermissions: PermissionFlagsBits.Administrator,
    ownerOnly: true,
    usage: 'kickbot [guild_id]',
    examples: ['kickbot', 'kickbot id_du_serveur'],
    description: "Je quitte un serveur si mon développeur l'a décidé !",
    options: [
        {
            name: 'serveur',
            description: 'Indiquer l\'ID du serveur que Grodou doit quitter',
            type: ApplicationCommandOptionType.String,
            required: true,
        }
    ],
    async runInteraction(client, interaction) {
        const guildID = interaction.options.getString("serveur");
        const guild = client.guilds.cache.get(guildID); // le serveur d'où le bot doit être kick
        const ownerGuild = client.users.cache.find(user => user.id === guild.ownerId); // le propriétaire du serveur en question

        
        await interaction.reply(`Oh, tu sais quoi ${interaction.user} ? J'ai quitté le serveur « **${guild.name}** » appartenant **${ownerGuild.tag}** parce qu'il n'y avait plus de Pommes Parfaites !`);
        await guild.leave();
    }
}
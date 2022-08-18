const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'emit',
    category: "Administration",
    permissions: ['Administrator'],
    defaultMemberPermissions: PermissionFlagsBits.Administrator,
    ownerOnly: true,
    usage: 'emit [eventName]',
    examples: ['emit', 'emit guildMemberAdd'],
    description: "J'émets un évènement de Discord au choix.",
    options: [
        {
            name: 'event',
            description: 'Choisir un évènement à emettre',
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [
                {
                    name: 'guildMemberAdd',
                    value: 'guildMemberAdd'
                },
                {
                    name: 'guildMemberRemove',
                    value: 'guildMemberRemove'
                },
                {
                    name: 'guildCreate',
                    value: 'guildCreate'
                }
            ]
        }
    ],
    async runInteraction(client, interaction) {
        const evtChoices = interaction.options.getString('event');

        if (evtChoices == 'guildMemberAdd') {
            client.emit('guildMemberAdd', interaction.member);
            interaction.reply({ content: "L'event **guildMemberAdd** a été émis !", ephemeral: true })
        }
        else if (evtChoices == 'guildMemberRemove') {
            client.emit('guildMemberRemove', interaction.member);
            interaction.reply({ content: "L'event **guildMemberRemove** a été émis !", ephemeral: true })
        }
        else {
            client.emit('guildCreate', interaction.guild);
            await interaction.reply({ content: "L'event **guildCreate** a été émis !", ephemeral: true })
        }
    }
}
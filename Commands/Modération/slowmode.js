const { ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: 'slowmode',
    category: "Modération",
    permissions: ['MANAGE_MESSAGES'],
    ownerOnly: false,
    usage: 'slowmode [number] <#channel> <reason>',
    examples: ['slowmode 15', 'clear 15 #nomDuSalon', 'clear 15 #nomDuSalon ceci_est_une_raison'],
    description: "Quand les paroles s'emballent, je les freine en activant le mode lent !",
    options: [
        {
            name: 'nombre',
            description: 'Choisir la valeur du mode lent en seconde',
            type: ApplicationCommandOptionType.Number,
            required: true
        },
        {
            name: 'salon',
            description: 'Le salon à ralentir',
            type: ApplicationCommandOptionType.Channel,
            channelTypes: [0],
            required: false
        },
        {
            name: 'raison',
            description: 'La raison du mode lent',
            type: ApplicationCommandOptionType.String,
            required: false
        }
    ],
    async runInteraction(client, interaction) {
        const value = interaction.options.getNumber("nombre");
        let reason = interaction.options.getString('raison');
        if (!reason) reason = "Aucune raison donnée";
        let channelTarget = interaction.options.getChannel('salon');
        if (!channelTarget) channelTarget = interaction.channel;

        if (value == 0) {
            await channelTarget.setRateLimitPerUser(0);
            await interaction.reply({ content: `Le mode lent a été désactivé sur ${channelTarget} avec succès !`, ephemeral: true })
            await channelTarget.send(`**✅ ${interaction.user} a désactivé le mode lent : vous pouvez poster de messages normalement.\n🪧 Raison : 🙶 \`${reason}\` 🙸**`)
        }
        else {
            await channelTarget.setRateLimitPerUser(value, [reason]);
            await interaction.reply({ content: `Le mode lent a été ajouté sur ${channelTarget} avec succès ! (\`${value} seconde${value > 1 ? "s" : ""}\`)`, ephemeral: true })
            await channelTarget.send(`**⏲ ${interaction.user} a activé le __mode lent__ : vous ne pouvez poster des messages que toutes les \`${value} seconde${value > 1 ? "s" : ""}\`.\n🪧 Raison : 🙶 \`${reason}\` 🙸**`)
        }
    }
}
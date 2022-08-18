const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js')

module.exports = {
    name: 'unban',
    category: "Modération",
    permissions: ['BanMembers'],
    defaultMemberPermissions: PermissionFlagsBits.BanMembers,
    ownerOnly: false,
    usage: 'unban [@member_id] <raison>',
    examples: ['unban @ID_de_l_utilisateur', 'unban @ID_de_l_utilisateur ceci_est_une_raison'],
    description: "J'autorise la rédemption des méchants en les débannissant du serveur !",
    options: [
        {
            name: 'memberid',
            description: 'L\'ID du membre à débannir',
            type: ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: 'raison',
            description: 'La raison du débannissement',
            type: ApplicationCommandOptionType.String,
            required: false
        }
    ],
    async runInteraction(client, interaction) {
        const target = interaction.options.getString("memberid");
        let reason = interaction.options.getString('raison') || "Aucune raison donnée";

        if (!target) return interaction.reply({ content: `❌ Woups, y'a comme qui dirait un petit problème ! L'id du membre n'a pas été trouvée... Impossible d'accéder à ta requête ! <:grodou2:903378318668222575>`, ephemeral: true, fetchReply: true });

        await interaction.reply({ content: `**⚠️ <@${target}> a été débanni par \`${interaction.user.tag}\` avec succès <:grodouAH:520329433752797184> !\n🪧 Raison : 🙶 \`${reason}\` 🙸**`, fetchReply: true });

        await interaction.guild.members.unban(target);
    }
}
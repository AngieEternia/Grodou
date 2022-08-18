const { ApplicationCommandOptionType, EmbedBuilder, AttachmentBuilder, PermissionFlagsBits } = require('discord.js')

module.exports = {
    name: 'setclaim',
    category: "Configuration",
    permissions: ['ManageGuild'],
    defaultMemberPermissions: PermissionFlagsBits.ManageGuild,
    ownerOnly: false,
    usage: 'setclaim [number]',
    examples: ['setclaim 300'],
    description: "J'enregistre dans ma mémoire le nombre de Poképièces reçues chaque jour avec /daily !",
    options: [
        {
            name: 'nombre',
            description: `Le nombre de Poképièces gagnées chaque jour avec /daily`,
            type: ApplicationCommandOptionType.Number,
            minValue: 1,
            required: true
        }
    ],
    async runInteraction(client, interaction) {
        const db = client.db;
        const amount = interaction.options.getNumber('nombre');

        db.query(`UPDATE serveur SET claim = '${amount}' WHERE guildID = ${interaction.guild.id}`)

        await interaction.reply({
            content: `D'accord ${interaction.user}, c'est bien noté ! Les membres du serveur gagneront désormais **${amount}** <:pokepiece:996867245714182235> lorsqu'ils feront la commande \`/daily\` !`,
            ephemeral: true
        });
    }
}
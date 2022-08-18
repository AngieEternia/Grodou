const { ApplicationCommandOptionType, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'unmute',
    category: "Modération",
    permissions: ['ModerateMembers'],
    defaultMemberPermissions: PermissionFlagsBits.ModerateMembers,
    ownerOnly: false,
    usage: 'unmute [@member] <raison>',
    examples: ['unmute @Utilisateur', 'unmute @Utilisateur ceci_est_une_raison'],
    description: "Je rends la parole aux gugusses qui ont été soumis au silence...!",
    options: [
        {
            name: 'utilisateur',
            description: 'Le membre à exclure',
            type: ApplicationCommandOptionType.User,
            required: true
        },
        {
            name: 'raison',
            description: 'La raison de l\'exclusion',
            type: ApplicationCommandOptionType.String,
            required: false
        }
    ],
    async runInteraction(client, interaction) {

        const db = client.db;
        const ID = await client.function.createID("MUTE");
        const target = interaction.options.getMember('utilisateur');
        let reason = interaction.options.getString('raison') || "Aucune raison donnée";

        if (!target.isCommunicationDisabled()) return interaction.reply({ content: "❌ Bah euh non ? Cette personne a déjà la parole !", ephemeral: true, fetchReply: true })

        target.timeout(null, `${reason} (Parole rendue par ${interaction.user.tag})`);
        try {
            await target.send(`<:grodouAH:520329433752797184> ! Tu sais quoi ? ${interaction.user.tag} t'a rendu la parole sur le serveur \`${interaction.guild.name}\` pour la saison suivante : \`${reason}\` !`);
        } catch (err) { }
        await interaction.reply({ content: `**⚠️ \`${interaction.user.tag}\` a rendu la parole à \`${target.displayName}\` avec succès <:grodouAH:520329433752797184> !\n🪧 Raison : 🙶 \`${reason}\` 🙸**`, fetchReply: true });

        let Embed = new EmbedBuilder()
            .setColor("#c0ff00")
            .setAuthor({
                name: `Utilisateur ayant récupéré la parole`,
                iconURL: "https://cdn.discordapp.com/emojis/1002700288081285260.png",
            })
            //.setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
            .setDescription(`◽️ **Parole retrouvée par :** ${target} (id : \`${target.id}\`)\n◽️ **Auteur de l'unmute :** ${interaction.user}\n◽️ **Motif de la reprise de parole :** \`\`\`${reason}\`\`\``)
            .setTimestamp();

        db.query(`SELECT * FROM logs WHERE type = 'modo' AND guildID = ${interaction.guild.id}`, async (err, req) => {

            if (req.length < 1) return;
            else {
                const logChannel = client.channels.cache.get(req[0].channelID);
                logChannel.send({ embeds: [Embed] });
            }
        })
    }
}
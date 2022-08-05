const { MessageEmbed } = require('discord.js');
const ms = require('ms');

module.exports = {
    name: 'mute',
    category: "Modération",
    permissions: ['MODERATE_MEMBERS'],
    ownerOnly: false,
    usage: 'mute [@member] [duration] <raison>',
    examples: ['mute @Utilisateur 4h', 'mute @Utilisateur 4hour ceci_est_une_raison'],
    description: "Je fais taire les gugusses qui parlent un peu trop...!",
    options: [
        {
            name: 'utilisateur',
            description: 'Le membre à exclure',
            type: 'USER',
            required: true
        },
        {
            name: 'durée',
            description: 'La durée de l\'exclusion',
            type: 'STRING',
            required: true
        },
        {
            name: 'raison',
            description: 'La raison de l\'exclusion',
            type: 'STRING',
            required: false
        }
    ],
    async runInteraction(client, interaction) {

        const db = client.db;
        const ID = await client.function.createID("MUTE");
        const target = interaction.options.getMember('utilisateur');
        const duration = interaction.options.getString('durée');
        const convertedTime = ms(duration);
        let reason = interaction.options.getString('raison');
        if (!reason) reason = "Aucune raison donnée";

        if (!target.moderatable) return interaction.reply({ content: `❌ Non, non, non ! Cette personne a un totem d'immunité, elle ne peut pas être exclue... <:grodou2:903378318668222575>`, ephemeral: true, fetchReply: true });
        if (!convertedTime) return interaction.reply({ content: `❌ Woups ! Il faut spécifier une durée valable ! <:grodou2:903378318668222575>`, ephemeral: true, fetchReply: true });
        if (convertedTime > 2419200000) return interaction.reply({ content: `❌ Le temps ne doit pas être supérieur à 28 jours ! <:grodou2:903378318668222575>`, ephemeral: true, fetchReply: true })
        if (target.isCommunicationDisabled()) return interaction.reply({ content: "❌ Bah euh non ? Cette personne est déjà muette !", ephemeral: true, fetchReply: true })

        target.timeout(convertedTime, `${reason} (Parole retirée par ${interaction.user.tag})`);
        try {
            await target.send(`<:grodouNO:520329945168347157> ! Bah alors, qu'est-ce que t'as dit ? T'as été rendu muet sur le serveur \`${interaction.guild.name}\` pendant \`${convertedDuration}\` pour la saison suivante : \`${reason}\` !`);
        } catch (err) { }
        await interaction.reply({ content: `**🚫 \`${target.displayName}\` a été exclu par \`${interaction.user.tag}\` pendant \`${convertedDuration}\` avec succès <:grodouAH:520329433752797184> !\n🪧 Raison : 🙶 \`${reason}\` 🙸**`, fetchReply: true });

        let sql = `INSERT INTO mutes (userID, authorID, muteID, guildID, reason, date, time) VALUES (${target.id}, '${interaction.user.id}', '${ID}', '${interaction.guild.id}', '${reason.replace(/'/g, "\\'")}', '${Date.now()}', '${duration}')`
        db.query(sql, function (err) {
            if (err) throw err;
        })

        let convertedDuration = ms(ms(duration), { long: true })
        let mapObj = { second: "seconde", minute: "minute", hour: "heure", day: "jour" } // mini dico pour traduire ms()
        convertedDuration = convertedDuration.replace(/second|minute|hour|day/gi, function (matched) { return mapObj[matched]; });
        let Embed = new MessageEmbed()
            .setColor("#ffe400")
            .setAuthor({
                name: `Utilisateur exclu`,
                iconURL: "https://cdn.discordapp.com/emojis/979738900908097616.png",
            })
            //.setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
            .setDescription(`Exclusion : ${target} (id : \`${target.id}\`)\nAuteur de l'exclusion : ${interaction.user}\nDurée de l'exclusion : \`${convertedDuration}\`\nMotif de l'exclusion : \`\`\`${reason}\`\`\``)
            .setTimestamp();

        db.query(`SELECT * FROM config WHERE type = 'logs' AND guildID = ${interaction.guild.id}`, async (err, req) => {

            if (req.length < 1) return;
            else {
                const logChannel = client.channels.cache.get(req[0].channelID);
                logChannel.send({ embeds: [Embed] });
            }
        })
    }
}
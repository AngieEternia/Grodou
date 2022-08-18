const { ApplicationCommandOptionType, EmbedBuilder, PermissionFlagsBits } = require('discord.js')

module.exports = {
    name: 'warn',
    category: "Modération",
    permissions: ['ModerateMembers'],
    defaultMemberPermissions: PermissionFlagsBits.ModerateMembers,
    ownerOnly: false,
    usage: 'warn [@member] <raison>',
    examples: ['warn @Utilisateur', 'warn @Utilisateur ceci_est_une_raison'],
    description: "Je donne un carton jaune aux petits enquiquineurs !",
    options: [
        {
            name: 'utilisateur',
            description: 'Le membre à avertir',
            type: ApplicationCommandOptionType.User,
            required: true
        },
        {
            name: 'raison',
            description: 'La raison de l\'avertissement',
            type: ApplicationCommandOptionType.String,
            required: false
        }
    ],
    async runInteraction(client, interaction) {

        const db = client.db;

        const ID = await client.function.createID("WARN");

        const target = interaction.options.getMember('utilisateur');
        let reason = interaction.options.getString('raison') || "Aucune raison donnée";

        if (!target.moderatable) return interaction.reply({ content: `❌ Non, non, non ! Cette personne a un totem d'immunité, elle ne peut pas être avertie... <:grodou2:903378318668222575>`, ephemeral: true, fetchReply: true });

        // Aout du rôle "avertissement"
        db.query(`SELECT * FROM serveur WHERE guildID = '${interaction.guild.id}'`, async (err, req) => {
            if (req.length < 1) return;
            if (!target.roles.cache.find(r => r.id === req[0].warn_role)) {
                await target.roles.add(req[0].warn_role, ['Avertissement reçu']);
            }
        })

        // Insertion du warn dans la base de données
        let sql = `INSERT INTO warns (userID, authorID, warnID, guildID, reason, date) VALUES(${target.id}, '${interaction.user.id}', '${ID}', '${interaction.guild.id}', '${reason.replace(/'/g, "\\'")}', '${Date.now()}')`;
        db.query(sql, function (err) {
            if (err) throw err;
        })

        // Condition pour le multi warn
        db.query(`SELECT * FROM warns WHERE guildID = '${interaction.guild.id}' AND userID = ${target.id}`, async (err, req) => {
            if (req.length < 1) return;

            if (req.length == 1) {
                try {
                    await target.send(`<:grodouNO:520329945168347157> ! Bah alors coco, t'as un avertissement sur le serveur \`${interaction.guild.name}\` pour la saison suivante : \`${reason}\` !`);
                } catch (err) { }

                await interaction.reply({ content: `**🚫 \`${target.displayName}\` a été averti par \`${interaction.user.tag}\` avec succès <:grodouAH:520329433752797184> !\n🪧 Raison : 🙶 \`${reason}\` 🙸**`, fetchReply: true });
            }
            // Si deuxième avertissement
            else if (req.length == 2) {
                const IDMute = await client.function.createID("MUTE");
                if (target.isCommunicationDisabled()) return interaction.reply({ content: "❌ Bah euh non ? Cette personne est déjà muette !", ephemeral: true, fetchReply: true })
                target.timeout(259200000, `Deuxième avertissement reçu (Parole retirée par ${interaction.user.tag})`); // 3 jours de mute
                try {
                    await target.send(`<:grodouNO:520329945168347157> ! J'espère que t'es fier de toi ! T'as été rendu muet sur le serveur \`${interaction.guild.name}\` pendant \`3 jours\` à cause du deuxième avertissement que tu as reçu !`);
                } catch (err) { }
                await interaction.reply({ content: `🚫 \`${target.displayName}\` a été averti et a été exclu par \`${interaction.user.tag}\` pendant \`3 jours\` avec succès <:grodouAH:520329433752797184> !\n🪧 Raison : 🙶 \`${reason} (deuxième avertissement)\` 🙸**`, fetchReply: true });

                // Insertion du warn dans la base de données
                let sql2 = `INSERT INTO mutes (userID, authorID, muteID, guildID, reason, date, time) VALUES (${target.id}, '${interaction.user.id}', '${IDMute}', '${interaction.guild.id}', 'Deuxième avertissement', '${Date.now()}', '3j')`
                db.query(sql2, function (err) {
                    if (err) throw err;
                })

                let Embed = new EmbedBuilder()
                    .setColor("#ffe400")
                    .setAuthor({
                        name: `Utilisateur exclu`,
                        iconURL: "https://cdn.discordapp.com/emojis/979738900908097616.png",
                    })
                    .setDescription(`Exclusion : ${target} (id : \`${target.id}\`)\nAuteur de l'exclusion : ${interaction.user}\nDurée de l'exclusion : \`3 jours\`\nMotif de l'exclusion : \`\`\`Deuxième avertissement reçu\`\`\``)
                    .setTimestamp();

                db.query(`SELECT * FROM logs WHERE type = 'modo' AND guildID = ${interaction.guild.id}`, async (err, reqMute) => {
                    if (reqMute.length < 1) return;
                    else {
                        const logChannel = client.channels.cache.get(reqMute[0].channelID);
                        logChannel.send({ embeds: [Embed] });
                    }
                })
            }
            // Si troisième avertissement
            else if (req.length == 3) {
                const IDKick = await client.function.createID("KICK");
                target.kick(`Troisième avertissement reçu (Expulsé par ${interaction.user.tag})`); // 1 Kick
                try {
                    await target.send(`<:grodouNO:520329945168347157> ! J'espère que t'es fier de toi ! T'as été expulsé du serveur \`${interaction.guild.name}\` à cause du troisième avertissement que tu as reçu !`);
                } catch (err) { }
                await interaction.reply({ content: `**🚫 \`${target.displayName}\` a été averti et a été expulsé par \`${interaction.user.tag}\` avec succès <:grodouAH:520329433752797184> !\n🪧 Raison : 🙶 \`${reason} (troisième avertissement)\` 🙸**`, fetchReply: true });

                // Insertion du warn dans la base de données
                let sql3 = `INSERT INTO kicks (userID, authorID, kickID, guildID, reason, date) VALUES (${target.id}, '${interaction.user.id}', '${IDKick}', '${interaction.guild.id}', 'Troisième avertissement', '${Date.now()}')`
                db.query(sql3, function (err) {
                    if (err) throw err;
                })

                let Embed = new EmbedBuilder()
                    .setColor("#d05c5c")
                    .setAuthor({
                        name: `Utilisateur expulsé`,
                        iconURL: "https://cdn.discordapp.com/emojis/979738900585148437.png",
                    })
                    //.setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                    .setDescription(`◽️ **Expulsé :** ${target} (id : \`${target.id}\`)\n◽️ **Auteur de l'expulsion :** ${interaction.user}\n◽️ **Motif de l'expulsion :** \`\`\`Troisième avertissement reçu\`\`\``)
                    .setTimestamp();

                db.query(`SELECT * FROM logs WHERE type = 'modo' AND guildID = ${interaction.guild.id}`, async (err, reqMute) => {
                    if (reqMute.length < 1) return;
                    else {
                        const logChannel = client.channels.cache.get(reqMute[0].channelID);
                        logChannel.send({ embeds: [Embed] });
                    }
                })
            }
            // Si quatrième et dernier avertissement
            else if (req.length == 4) {
                const IDBan = await client.function.createID("BAN");
                target.ban({ reason: `Quatrième avertissement reçu (Banni par ${interaction.user.tag})` }); // 1 ban
                try {
                    await target.send(`<:grodouNO:520329945168347157> ! Mais ça va pas du tout là ! T'as réussi à te faire bannir du serveur \`${interaction.guild.name}\` à cause du quatrième avertissement que tu as reçu !`);
                } catch (err) { }
                await interaction.reply({ content: `**🚫 \`${target.displayName}\` a été averti et a été banni par \`${interaction.user.tag}\` avec succès <:grodouAH:520329433752797184> !\n🪧 Raison : 🙶 \`${reason} (quatrième avertissement)\` 🙸**`, fetchReply: true });

                // Insertion du warn dans la base de données
                let sql4 = `INSERT INTO bans (userID, authorID, banID, guildID, reason, date, time) VALUES (${target.id}, '${interaction.user.id}', '${IDBan}', '${interaction.guild.id}', 'Quatrième avertissement', '${Date.now()}', 'Définitif')`
                db.query(sql4, function (err) {
                    if (err) throw err;
                })
            }
        })

        // Envoie du logs
        let Embed = new EmbedBuilder()
            .setColor("#ff8a00")
            .setAuthor({
                name: `Utilisateur averti`,
                iconURL: "https://cdn.discordapp.com/emojis/979738900589334548.png",
            })
            //.setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
            .setDescription(`◽️ **Utilisateur averti :** ${target} (id : \`${target.id}\`)\n◽️ **Auteur de l'avertissement :** ${interaction.user}\n◽️ **Motif de l'avertissement :** \`\`\`${reason}\`\`\``)
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
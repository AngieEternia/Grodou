const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
    name: 'server',
    category: "Informations",
    permissions: ['SendMessages'],
    defaultMemberPermissions: PermissionFlagsBits.SendMessages,
    ownerOnly: false,
    usage: 'server',
    examples: ['server'],
    description: "Je révèle toutes les infos à savoir sur le serveur où tu te trouves !",

    async runInteraction(client, interaction) {
        //On crée les const pour les interactions
        const { guild } = interaction;
        const { name, description, premiumSubscriptionCount, premiumTier, createdAt, verificationLevel, members, memberCount, maximumMembers, channels, emojis, stickers, rulesChannel, afkChannel, vanityURLCode } = guild;

        //Autres variables utiles
        let threadCount = channels.cache.filter((c) => c.type === 10).size + channels.cache.filter((c) => c.type === 12).size + channels.cache.filter((c) => c.type === 11).size
        let nbEmoteFixe = emojis.cache.filter((e) => !e.animated).size;
        let nbEmoteAnimée = emojis.cache.filter((e) => e.animated).size;

        //Dictionnaires en vrac...
        const dicoTiers = { 0: "Pas de niveau", 1: "Niveau 1", 2: "Niveau 2", 3: "Niveau 3" };
        const dicoProtection = { 0: "Aucune", 1: "Faible", 2: "Moyenne", 3: "Élevée", 4: "Maximale" };

        let embed = new EmbedBuilder()
            .setColor(client.color)
            .setAuthor({ name: `Faisons le point sur ${name}`, iconURL: 'https://cdn.discordapp.com/emojis/897582796434985031.png' })
            .setDescription(description ? description : `Détails sur le serveur ${name}, pour tout savoir de sa création jusqu'aux nombres de salons présents !`)
            .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
            .addFields(
                {
                    name: `<:sep1:975384221138948126>  ${('Généralités').toUpperCase()}  <:sep3:975384220849557545>`,
                    value: [
                        `> ◽️ **Nom** : \`${name}\``,
                        `> ◽️ **Propriétaire** : \`${(await interaction.guild.fetchOwner()).user.tag}\``,
                        `> ◽️ **Créé le** : <t:${Math.floor(createdAt / 1000)}:D>`,
                        `> ◽️ **Identifiant** : \`${interaction.guild.id}\``,
                        `> ◽️ **Protection** : \`${dicoProtection[verificationLevel]}\``,
                        `> ◽️ **URL** : \`${vanityURLCode ? `discord.gg/${vanityURLCode}` : 'Aucune'}\``,
                    ].join("\n")
                },
                {
                    name: `<:sep1:975384221138948126>  ${('Nitro et Stats').toUpperCase()}  <:sep3:975384220849557545>`,
                    value: [
                        `> ◽️ **Tier** : \`${dicoTiers[premiumTier]}\``,
                        `> ◽️ **Boost${premiumSubscriptionCount > 1 ? "s" : ""}** : \`${premiumSubscriptionCount}\``,
                        `> ◽️ **Booster${members.cache.filter((m) => m.premiumSince).size > 1 ? "s" : ""}** : \`${members.cache.filter((m) => m.premiumSince).size}\``,
                        `> ▬▬▬▬▬▬▬▬`,
                        `> ◽️ **Rôle${guild.roles.cache.size - 1 > 1 ? "s" : ""}** : \`${guild.roles.cache.size - 1}\``,
                        `> ◽️ **Emoji${(nbEmoteFixe + nbEmoteAnimée) > 1 ? "s" : ""}** : \`${nbEmoteFixe} fixe${nbEmoteFixe > 1 ? "s" : ""}\` et \`${nbEmoteAnimée} animé${nbEmoteAnimée > 1 ? "s" : ""}\` `,
                        `> ◽️ **Sticker${stickers.cache.size > 1 ? "s" : ""}** : \`${stickers.cache.size}\``
                    ].join("\n")
                },
                {
                    name: `<:sep1:975384221138948126>  ${('Membres').toUpperCase()}  <:sep3:975384220849557545>`,
                    value: [
                        `> ◽️ **Membre${members.cache.filter((m) => !m.user.bot).size > 1 ? "s" : ""}** : \`${members.cache.filter((m) => !m.user.bot).size}\``,
                        `> ◽️ **Robot${members.cache.filter((m) => m.user.bot).size > 1 ? "s" : ""}** : \`${members.cache.filter((m) => m.user.bot).size}\``,
                        `> ▬▬▬▬▬▬▬▬`,
                        `> ◽️ <:d_online:977565914990010409> : \`${members.cache.filter(member => member.presence?.status == "online").size} en ligne\``,
                        `> ◽️ <:d_dnd:977565915438788648> : \`${members.cache.filter(member => member.presence?.status == "dnd").size} occupé${members.cache.filter(member => member.presence?.status == "dnd").size > 1 ? "s" : ""}\``,
                        `> ◽️ <:d_idle:977565915392659487> : \`${members.cache.filter(member => member.presence?.status == "idle").size} absent${members.cache.filter(member => member.presence?.status == "idle").size > 1 ? "s" : ""}\``,
                        `> ◽️ <:d_offline:977565915417804822> : \`${members.cache.filter(member => !member.presence || member.presence.status == "offline").size} hors-ligne\``,
                        `> ▬▬▬▬▬▬▬▬`,
                        `> <:blue_arrow_r:979431534828355595>   **Total** : \`${memberCount.toLocaleString()}/${maximumMembers.toLocaleString()} utilisateurs\``
                    ].join("\n")
                },
                {
                    name: `<:sep1:975384221138948126>  ${('Salons').toUpperCase()}  <:sep3:975384220849557545>`,
                    value: [
                        `> ◽️ **Règlement** : ${rulesChannel ? rulesChannel : "\`Aucun\`"}`,
                        `> ◽️ **AFK** : ${afkChannel ? afkChannel : "\`Aucun\`"}`,
                        `> ▬▬▬▬▬▬▬▬`,
                        `> ◽️ **Catégorie${channels.cache.filter((c) => c.type === 4).size > 1 ? "s" : ""}** : \`${channels.cache.filter((c) => c.type === 4).size}\``,
                        `> ◽️ **Textuel${channels.cache.filter((c) => c.type === 0).size > 1 ? "s" : ""}** : \`${channels.cache.filter((c) => c.type === 0).size}\``,
                        `> ◽️ **Voc${channels.cache.filter((c) => c.type === 2).size > 1 ? "aux" : "al"}** : \`${channels.cache.filter((c) => c.type === 2).size}\``,
                        `> ◽️ **Thread${threadCount > 1 ? "s" : ""}** : \`${threadCount}\``,
                        `> ◽️ **Annonce${channels.cache.filter((c) => c.type === 5).size > 1 ? "s" : ""}** : \`${channels.cache.filter((c) => c.type === 5).size}\``,
                        `> ◽️ **Conférence${channels.cache.filter((c) => c.type === 13).size > 1 ? "s" : ""}** : \`${channels.cache.filter((c) => c.type === 13).size}\``,
                        `> ▬▬▬▬▬▬▬▬`,
                        `> <:blue_arrow_r:979431534828355595>   **Total** : \`${channels.cache.size} salons\``
                    ].join("\n")
                }
            )
            .setImage(interaction.guild.bannerURL({ dynamic: true, size: 4096 }))
            .setTimestamp()
            .setFooter({ text: client.embedFooter, iconURL: client.embedFootIcon });

        await interaction.reply({ embeds: [embed] })

    }
}
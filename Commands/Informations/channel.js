const { ApplicationCommandOptionType, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'channel',
    category: "Informations",
    permissions: ['SendMessages'],
    defaultMemberPermissions: PermissionFlagsBits.SendMessages,
    ownerOnly: false,
    usage: 'channel <#channel>',
    examples: ['channel', 'channel #nomDuSalon'],
    description: "Je te donne tous les détails sur un salon du serveur !",
    options: [
        {
            name: 'salon',
            description: 'Le salon dont vous souhaitez voir les informations',
            type: ApplicationCommandOptionType.Channel,
            required: false
        }
    ],
    async runInteraction(client, interaction) {
        let channel = interaction.options.getChannel('salon') || interaction.channel;

        //Dictionnaires en vrac...
        const dicoTypes = {
            1: "Mesage privé", // DM
            3: "Groupe privé", // GroupDM
            4: "Catégorie", // GuildCategory
            14: "Dossier de salons", // GuildDirectory
            15: "Forum", // GuildForum
            5: "Salon des annonces", // GuildNews
            10: "Fil d'annonces", // GuildNewsThread
            12: "Fil privé", // GuildPrivateThread
            11: "Fil public", // GuildPublicThread
            13: "Salon de conférence", // GuildStageVoice
            0: "Salon textuel", // GuildText
            2: "Salon vocal", // GuildVoice
            undefined: "Inconnu", // undefined
        };
        const dicoSlowmode = {
            5: "5 secondes",
            10: "10 secondes",
            15: "15 secondes",
            30: "30 secondes",
            60: "1 minute",
            120: "2 minutes",
            300: "5 minutes",
            600: "10 minutes",
            900: "15 minutes",
            1800: "30 minutes",
            3600: "1 heure",
            7200: "2 heures",
            21600: "6 heures",
        };

        // On const des trucs pour se simplifier la vie
        const categoryChannel = interaction.guild.channels.cache.filter((c) => c.parentId === channel.parentId && c.type === channel.type).size
        
        let Embed = new EmbedBuilder()
            .setColor(client.color)
            .setAuthor({ name: `Petit topo sur le salon ${channel.name}`, iconURL: 'https://cdn.discordapp.com/emojis/897582796434985031.png' })
            .setDescription(`${channel.topic ? `**Sujet du salon :** ${channel.topic}` : `Détails sur le salon ${channel}, pour tout savoir de sa création jusqu'aux permissions`}`)
            .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
            .addFields(
                {
                    name:`<:sep1:975384221138948126>  Généralités  <:sep3:975384220849557545>`,
                    value: [
                        `> ◽️ **Nom** : \`${channel.name}\``,
                        `> ◽️ **Accès :**  ${channel}`,
                        `> ◽️ **Type** : \`${dicoTypes[channel.type]}\``,
                        `> ◽️ **Identifiant** : \`${channel.id}\``,
                        `> ◽️ **Date de création** : <t:${Math.floor(channel.createdAt / 1000)}:D>`,
                    ].join("\n")
                },
                {
                    name:`<:sep1:975384221138948126>  Spécificités  <:sep3:975384220849557545>`,
                    value: [
                        `> ◽️ **Parent** : \`${channel.parentId ? (interaction.guild.channels.cache.get(channel.parentId)).name : "Aucun"}\``,
                        `> ◽️ **Enfant${channel.children ? (channel.children.size > 1 ? "s" : "") : ""}** : \`${channel.children ? channel.children.size : "Aucun"}\``,
                        `> ◽️ **NSFW** : \`${channel.nsfw === true ? "Oui" : "Non"}\``,
                        `> ◽️ **Ralentissement** : \`${channel.rateLimitPerUser ? dicoSlowmode[channel.rateLimitPerUser] : "Aucun"}\``,
                        `> ◽️ **Position** : \`${channel.position === undefined ? "—" : `${channel.position+1}/${categoryChannel}`}\``,
                    ].join("\n")
                }
            )
            .setTimestamp()
            .setFooter({text: client.embedFooter, iconURL: client.embedFootIcon});
        
        await interaction.reply({ embeds: [Embed] })
    }
}
const { ApplicationCommandOptionType, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'role',
    category: "Informations",
    permissions: ['SendMessages'],
    defaultMemberPermissions: PermissionFlagsBits.SendMessages,
    ownerOnly: false,
    usage: 'role [#role]',
    examples: ['role', 'role #nomDuRole'],
    description: "Je te donne tous les détails sur un des rôles du serveur !",
    options: [
        {
            name: 'role',
            description: 'Le rôle dont vous souhaitez voir les informations',
            type: ApplicationCommandOptionType.Role,
            required: true
        }
    ],
    async runInteraction(client, interaction) {
        const role = interaction.options.getRole('role');

        //Dictionnaire pour les permissions
        const dicoPermissions = {
            AddReactions: "Ajouter des réactions",
            Administrator: "Administrateur",
            AttachFiles: "Joindre des fichiers",
            BanMembers: "Bannir des membres",
            ChangeNickname: "Changer les pseudos",
            Connect: "Se connecter",
            CreateInstantInvite: "Créer une invitation",
            CreatePrivateThreads: "Créer des fils privés",
            CreatePublicThreads: "Créer des fils publics",
            DeafenMembers: "Mettre en sourdine des membres",
            EmbedLinks: "Intégrer des liens",
            KickMembers: "Expulser des membres",
            ManageChannels: "Gérer les salons",
            ManageEmojisAndStickers: "Gérer les émojis et les autocollants",
            ManageEvents: "Gérer les événements",
            ManageGuild: "Gérer le serveur",
            ManageMessages: "Gérer les messages",
            ManageNicknames: "Gérer les pseudos",
            ManageRoles: "Gérer les rôles",
            ManageThreads: "Gérer les fils",
            ManageWebhooks: "Gérer les webhooks",
            MentionEveryone: "Mentionner @everyone, @here et tous les rôles",
            ModerateMembers: "Exclure temporairement des membres",
            MoveMembers: "Déplacer des membres",
            MuteMembers: "Rendre les membres muets",
            PrioritySpeaker: "Voix prioritaire",
            ReadMessageHistory: "Voir les anciens messages",
            RequestToSpeak: "Demande de prise de parole",
            SendMessages: "Envoyer des messages",
            SendMessagesInThreads: "Envoyer des messages dans les fils",
            SendTTSMessages: "Envoyer des messages de synthèse vocale",
            Speak: "Parler",
            Stream: "Vidéo",
            UseApplicationCommands: "Utiliser les commandes de l'application",
            UseEmbeddedActivities: "Utiliser les Activités",
            UseExternalEmojis: "Utiliser des émojis externes",
            UseExternalStickers: "Utiliser des autocollants externes",
            UseVAD: "Utiliser la Détection de la voix",
            ViewAuditLog: "Voir les logs du serveurs",
            ViewChannel: "Voir les salons",
            ViewGuildInsights: "Voir les stats du serveur"
        }

        const embed = new EmbedBuilder()
            .setColor(client.color)
            .setAuthor({ name: `Petit topo sur le rôle ${role.name}`, iconURL: 'https://cdn.discordapp.com/emojis/897582796434985031.png' })
            .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
            .addFields(
                {
                    name: `<:sep1:975384221138948126>  Généralités  <:sep3:975384220849557545>`,
                    value: [
                        `> ◽️ **Nom** : \`${role.name}\``,
                        `> ◽️ **Aperçu** : ${role}`,
                        `> ◽️ **Couleur** : \`${role.hexColor}\``,
                        `> ◽️ **Identifiant** : \`${role.id}\``,
                        `> ◽️ **Icône** : \`${role.icon ? "Oui" : "Non"}\``,
                        `> ◽️ **Date de création** : <t:${Math.floor(role.createdAt / 1000)}:D>`,
                    ].join("\n")
                },
                {
                    name: `<:sep1:975384221138948126>  Spécificités  <:sep3:975384220849557545>`,
                    value: [
                        `> ◽️ **Membres ayant ce rôle** : \`${role.members.size}\``,
                        `> ◽️ **Mentionnable** : \`${role.mentionable ? "Oui" : "Non"}\``,
                        `> ◽️ **Position** : \`${interaction.guild.roles.cache.size - role.position}/${interaction.guild.roles.cache.size - 1}\``,
                        `> ◽️ **Permissions** : \`${role.permissions.toArray().map(e => dicoPermissions[e]).join(", ")}\``,
                    ].join("\n")
                }
            )
            .setTimestamp()
            .setFooter({ text: client.embedFooter, iconURL: client.embedFootIcon });

        await interaction.reply({ embeds: [embed] })
    }
}
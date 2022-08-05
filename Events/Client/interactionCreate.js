const ownerId = '92712456689848320'

module.exports = {
    name: 'interactionCreate',
    once: false,
    async execute(client, interaction) {
        if (interaction.isCommand() || interaction.isContextMenu()) {
            const cmd = client.commands.get(interaction.commandName);
            if (!cmd) return interaction.reply({ content: `Hey mon pote, cette commande n'existe pas !`, fetchReply: true });

            let permissionsList = cmd.permissions.join(', ');
            permissionsList = permissionsList.replace(/CREATE_INSTANT_INVITE|KICK_MEMBERS|BAN_MEMBERS|ADMINISTRATOR|MANAGE_CHANNELS|MANAGE_GUILD|ADD_REACTIONS|VIEW_AUDIT_LOG|PRIORITY_SPEAKER|STREAM|VIEW_CHANNEL|SEND_MESSAGES|SEND_TTS_MESSAGES|MANAGE_MESSAGES|EMBED_LINKS|ATTACH_FILES|READ_MESSAGE_HISTORY|MENTION_EVERYONE|USE_EXTERNAL_EMOJIS|VIEW_GUILD_INSIGHTS|CONNECT|SPEAK|MUTE_MEMBERS|DEAFEN_MEMBERS|MOVE_MEMBERS|USE_VAD|CHANGE_NICKNAME|MANAGE_NICKNAMES|MANAGE_ROLES|MANAGE_WEBHOOKS|MANAGE_EMOJIS_AND_STICKERS|USE_APPLICATION_COMMANDS|REQUEST_TO_SPEAK|MANAGE_EVENTS|MANAGE_THREADS|USE_PUBLIC_THREADS|CREATE_PUBLIC_THREADS|USE_PRIVATE_THREADS|CREATE_PRIVATE_THREADS|USE_EXTERNAL_STICKERS|SEND_MESSAGES_IN_THREADS|START_EMBEDDED_ACTIVITIES|MODERATE_MEMBER/gi, function (matched) { return dicoPermissions[matched]; });

            if (cmd.ownerOnly) {
                if (interaction.user.id != ownerId) {
                    return interaction.reply({ content: `**❌ Eh oh ${interaction.member}, y'a que mon développeur qui peut exécuter cette commande !**`, ephemeral: true, fetchReply: true })
                }
            }

            if (!interaction.member.permissions.has([cmd.permissions])) return interaction.reply({ content: `**❌ Eh oh ${interaction.member}, t'as pas les permissions pour exécuter cette commande !\n🪧 Permissions requises : 🙶 \`${permissionsList}\` 🙸**`, ephemeral: true, fetchReply: true })

            cmd.runInteraction(client, interaction);
        }
        else if (interaction.isButton()) {
            const btn = client.btn.get(interaction.customId);
            if (!btn) return;
            else {
                btn.runInteraction(client, interaction, db);
            }
        } else if (interaction.isSelectMenu()) {
            const select = client.selects.get(interaction.customId);
            if (!select) return;
            else {
                select.runInteraction(client, interaction, db);
            }
        }
    }
}

const dicoPermissions = { ADD_REACTIONS: "Ajouter des réactions", ADMINISTRATOR: "Administrateur", ATTACH_FILES: "Joindre des fichiers", BAN_MEMBERS: "Bannir des membres", CHANGE_NICKNAME: "Changer les pseudos", CONNECT: "Se connecter", CREATE_INSTANT_INVITE: "Créer une invitation", CREATE_PRIVATE_THREADS: "Créer des fils privés", CREATE_PUBLIC_THREADS: "Créer des fils publics", DEAFEN_MEMBERS: "Mettre en sourdine des membres", EMBED_LINKS: "Intégrer des liens", KICK_MEMBERS: "Expulser des membres", MANAGE_CHANNELS: "Gérer les salons", MANAGE_EMOJIS_AND_STICKERS: "Gérer les émojis et les autocollants", MANAGE_EVENTS: "Gérer les événements", MANAGE_GUILD: "Gérer le serveur", MANAGE_MESSAGES: "Gérer les messages", MANAGE_NICKNAMES: "Gérer les pseudos", MANAGE_ROLES: "Gérer les rôles", MANAGE_THREADS: "Gérer les fils", MANAGE_WEBHOOKS: "Gérer les webhooks", MENTION_EVERYONE: "Mentionner @everyone, @here et tous les rôles", MODERATE_MEMBERS: "Exclure temporairement des membres", MOVE_MEMBERS: "Déplacer des membres", MUTE_MEMBERS: "Rendre les membres muets", PRIORITY_SPEAKER: "Voix prioritaire", READ_MESSAGE_HISTORY: "Voir les anciens messages", REQUEST_TO_SPEAK: "Demande de prise de parole", SEND_MESSAGES: "Envoyer des messages", SEND_MESSAGES_IN_THREADS: "Envoyer des messages dans les fils", SEND_TTS_MESSAGES: "Envoyer des messages de synthèse vocale", SPEAK: "Parler", STREAM: "Vidéo", USE_APPLICATION_COMMANDS: "Utiliser les commandes de l'application", USE_EMBEDDED_ACTIVITIES: "Utiliser les Activités", USE_EXTERNAL_EMOJIS: "Utiliser des émojis externes", USE_EXTERNAL_STICKERS: "Utiliser des autocollants externes", USE_PRIVATE_THREADS: "Utiliser les fils privés", USE_PUBLIC_THREADS: "Utiliser les fils publics", USE_VAD: "Utiliser la Détection de la voix", VIEW_AUDIT_LOG: "Voir les logs du serveurs", VIEW_CHANNEL: "Voir les salons", VIEW_GUILD_INSIGHTS: "Voir les stats du serveur" }
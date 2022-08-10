const ownerId = '92712456689848320'
const { InteractionType } = require('discord.js')

module.exports = {
    name: 'interactionCreate',
    once: false,
    async execute(client, interaction) {
        if (interaction.type === InteractionType.ApplicationCommand) {
            const cmd = client.commands.get(interaction.commandName);

            if (!cmd) return interaction.reply({
                content: `Hey mon pote, cette commande n'existe pas !`,
                fetchReply: true
            });

            let permissionsList = cmd.permissions.join(', ');
            permissionsList = permissionsList.replace(/AddReactions|Administrator|AttachFiles|BanMembers|ChangeNickname|Connect|CreateInstantInvite|CreatePrivateThreads|CreatePublicThreads|DeafenMembers|EmbedLinks|KickMembers|ManageChannels|ManageEmojisAndStickers|ManageEvents|ManageGuild|ManageMessages|ManageNicknames|ManageRoles|ManageThreads|ManageWebhooks|MentionEveryone|ModerateMembers|MoveMemberMuteMembers|PrioritySpeaker|ReadMessageHistory|RequestToSpeak|SendMessages|SendMessagesInThreads|SendTTSMessages|Speak|Stream|UseApplicationCommands|UseEmbeddedActivitieUseExternalEmojis|UseExternalStickers|UseVAD|ViewAuditLog|ViewChannel|ViewGuildInsights/gi, function (matched) { return dicoPermissions[matched]; });

            if (cmd.ownerOnly) {
                if (interaction.user.id != ownerId) {
                    return interaction.reply({
                        content: `**❌ Eh oh ${interaction.member}, y'a que mon développeur qui peut exécuter cette commande !**`,
                        ephemeral: true,
                        fetchReply: true
                    })
                }
            }

            if (!interaction.member.permissions.has([cmd.permissions])) {
                return interaction.reply({
                    content: `**❌ Eh oh ${interaction.member}, t'as pas les permissions pour exécuter cette commande !\n🪧 ${(permissionsList.split(',')).length > 1 ? "Permissions requises" : "Permission requise"} : 🙶 \`${permissionsList}\` 🙸**`,
                    ephemeral: true,
                    fetchReply: true
                })
            }

            cmd.runInteraction(client, interaction);
        }
        else if (interaction.isAutocomplete()) {
            const cmd = client.commands.get(interaction.commandName);
            if (!cmd) return;
            cmd.runAutocomplete(client, interaction);
        }
        else if (interaction.isButton()) {
            const btn = client.buttons.get(interaction.customId);
            if (!btn) return interaction.reply("Ce bouton n'existe pas!");
            else {
                btn.runInteraction(client, interaction);
            }
        }
        else if (interaction.isSelectMenu()) {
            const select = client.selects.get(interaction.customId);
            if (!select) return interaction.reply("Ce menu n'existe pas!");
            else {
                select.runInteraction(client, interaction);
            }
        }
    }
}

const dicoPermissions = {
    AddReactions: "Ajouter des réactions", Administrator: "Administrateur", AttachFiles: "Joindre des fichiers", BanMembers: "Bannir des membres", ChangeNickname: "Changer les pseudos", Connect: "Se connecter", CreateInstantInvite: "Créer une invitation", CreatePrivateThreads: "Créer des fils privés", CreatePublicThreads: "Créer des fils publics", DeafenMembers: "Mettre en sourdine des membres", EmbedLinks: "Intégrer des liens", KickMembers: "Expulser des membres", ManageChannels: "Gérer les salons", ManageEmojisAndStickers: "Gérer les émojis et les autocollants", ManageEvents: "Gérer les événements", ManageGuild: "Gérer le serveur", ManageMessages: "Gérer les messages", ManageNicknames: "Gérer les pseudos", ManageRoles: "Gérer les rôles", ManageThreads: "Gérer les fils", ManageWebhooks: "Gérer les webhooks", MentionEveryone: "Mentionner @everyone, @here et tous les rôles", ModerateMembers: "Exclure temporairement des membres", MoveMembers: "Déplacer des membres", MuteMembers: "Rendre les membres muets", PrioritySpeaker: "Voix prioritaire", ReadMessageHistory: "Voir les anciens messages", RequestToSpeak: "Demande de prise de parole", SendMessages: "Envoyer des messages", SendMessagesInThreads: "Envoyer des messages dans les fils", SendTTSMessages: "Envoyer des messages de synthèse vocale", Speak: "Parler", Stream: "Vidéo", UseApplicationCommands: "Utiliser les commandes de l'application", UseEmbeddedActivities: "Utiliser les Activités", UseExternalEmojis: "Utiliser des émojis externes", UseExternalStickers: "Utiliser des autocollants externes", UseVAD: "Utiliser la Détection de la voix", ViewAuditLog: "Voir les logs du serveurs", ViewChannel: "Voir les salons", ViewGuildInsights: "Voir les stats du serveur"
}
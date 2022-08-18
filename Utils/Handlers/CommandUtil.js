const { promisify } = require('util');
const { glob } = require('glob');
const pGlob = promisify(glob);
const Logger = require(`../Logger`);
const { ApplicationCommandType } = require('discord.js')

module.exports = async client => {
    const explore = await pGlob(`${process.cwd()}/Commands/*/*.js`);
    console.log("----------------------------------------------------");
    explore.map(async cmdFile => {

        const cmd = require(cmdFile);

        if (!cmd.name) return Logger.warn(`Commande non-chargée : merci d'indiquer un nom ↓\n➡️  Fichier : ${cmdFile}`);

        if (!cmd.description && cmd.type != ApplicationCommandType.User) return Logger.warn(`Commande non-chargée : merci d'indiquer une description ↓\n➡️  Fichier : ${cmdFile}`);

        if (!cmd.category) return Logger.warn(`Commande non-chargée : merci d'indiquer une catégorie ↓\n➡️  Fichier : ${cmdFile}`);

        if (!cmd.permissions) return Logger.warn(`Commande non-chargée : merci d'indiquer des permissions ↓\n➡️  Fichier : ${cmdFile}`);

        if (!cmd.defaultMemberPermissions) return Logger.warn(`Commande non-chargée : merci d'indiquer les permissions par défaut ↓\n➡️  Fichier : ${cmdFile}`);

        if (cmd.ownerOnly === undefined) return Logger.warn(`Commande non-chargée : merci d'indiquer si la commande est ownerOnly ↓\n➡️  Fichier : ${cmdFile}`);

        if (!cmd.usage) return Logger.warn(`Commande non-chargée : merci d'indiquer une utilisation  ↓\n➡️  Fichier : ${cmdFile}`);

        if (!cmd.examples) return Logger.warn(`Commande non-chargée : merci d'indiquer des exemples ↓\n➡️  Fichier : ${cmdFile}`);

        cmd.permissions.forEach(permission => {
            if (!permissionList.includes(permission)) return Logger.typo(`Commande non-chargée : erreur de typo sur la permission ${permission} ↓\n➡️  Fichier : ${cmdFile}`);
        })

        client.commands.set(cmd.name, cmd);
        Logger.command(` —  ${cmd.name}`)
    });
};

const permissionList = ['AddReactions', 'Administrator', 'AttachFiles', 'BanMembers', 'ChangeNickname', 'Connect', 'CreateInstantInvite', 'CreatePrivateThreads', 'CreatePublicThreads', 'DeafenMembers', 'EmbedLinks', 'KickMembers', 'ManageChannels', 'ManageEmojisAndStickers', 'ManageEvents', 'ManageGuild', 'ManageMessages', 'ManageNicknames', 'ManageRoles', 'ManageThreads', 'ManageWebhooks', 'MentionEveryone', 'ModerateMembers', 'MoveMembers', 'MuteMembers', 'PrioritySpeaker', 'ReadMessageHistory', 'RequestToSpeak', 'SendMessages', 'SendMessagesInThreads', 'SendTTSMessages', 'Speak', 'Stream', 'UseApplicationCommands', 'UseEmbeddedActivities', 'UseExternalEmojis', 'UseExternalStickers', 'UseVAD', 'ViewAuditLog', 'ViewChannel', 'ViewGuildInsights']
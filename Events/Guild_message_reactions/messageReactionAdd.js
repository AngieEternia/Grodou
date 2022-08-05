const { Message } = require("discord.js");

module.exports = {
    name: 'messageReactionAdd',
    once: false,
    async execute(client, messageReaction, user) {
        const message = messageReaction.message;
        const emojisName = messageReaction.emoji.name;
        const member = message.guild.members.cache.get(user.id)

        if (member.user.bot) return;

        if (messageReaction.partial) {
            try {
                await messageReaction.fetch();
            } catch (err) {
                console.log('Impossible de récupérer les messages');
            }
        }

        if (emojisName === '🟥') message.delete();
        if (emojisName === '🟦') message.reactions.removeAll();
        if (emojisName === '🟩') message.channel.send("cc test réussi");
        //if (emojisName === '🟩') member.send("cc test réussi");
    }
}
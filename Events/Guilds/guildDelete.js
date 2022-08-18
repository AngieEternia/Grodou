const { AttachmentBuilder, EmbedBuilder } = require('discord.js')
const Logger = require(`../../Utils/Logger`);
const prefix = 't!';

module.exports = {
    name: 'guildDelete',
    once: false,
    async execute(client, guild) {
        const db = client.db;
        db.query(`UPDATE serveur SET warn_role = "" WHERE guildID = ${guild.id}`);

        Logger.client(` —  ${client.user.username} a quitté le serveur « ${guild.name} » !`);
    }
}
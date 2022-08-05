const { MessageAttachment, MessageEmbed } = require('discord.js')
const Logger = require(`../../Utils/Logger`);

module.exports = {
    name: 'guildCreate',
    once: false,
    async execute(client, guild) {

        // Message de Grodou quand il arrive sur un nouveau serveur
        //const thumbnail = new MessageAttachment(`./Img/smiles/grodouSmile.png`, `miniature.png`);
        let joinEmbed = new MessageEmbed()
            .setColor(client.color)
            .setTitle("Oh, bien le bonjour, merci pour l'invitation ! 👋")
            //.setThumbnail(`attachment://${thumbnail.name}`)
            .setDescription(`Je m'appelle ${client.user} et je suis le Maître de la Guilde de Grodoudou. Enchanté ! Bon, sur Discord, je suis avant tout un **client polyvalent** ayant pour but d'aider quant à la gestion du serveur.\n\nJe possède tout un tas de commandes très chouettes, pour sûr ! Elles sont toutes visibles en faisant \`/help\`. Je ne fonctionne qu'en ***slashcommands*** !\n\nPour que je fonctionne correctement, **n'oublie pas d'écrire au moins un message après mon arrivée** pour que j'enregistre ton serveur dans ma base de données (sinon je vais être tout cassé...) !\n\n**Il m'arrive aussi de dire tout un tas de bêtises mais ça, c'est une autre histoire... <:grodou3:903378318362017803> A bientôt sur ${guild.name} !**`)
            .setTimestamp()
            .setFooter({ text: client.embedFooter, iconURL: client.embedFootIcon });

        if (guild.systemChannelId !== null) {
            Logger.client(` —  ${client.user.username} a été ajouté au serveur « ${guild.name} » !`);
            return guild.systemChannel.send({ embeds: [joinEmbed] })
        }
        else {
            const channel = guild.channels.cache.find(channel => channel.type === 'GUILD_TEXT' && channel.permissionsFor(guild.me).has('SEND_MESSAGES'))
            Logger.client(` —  ${client.user.username} a été ajouté au serveur « ${guild.name} » !`);
            channel.send({ embeds: [joinEmbed] })
        }
    }
}
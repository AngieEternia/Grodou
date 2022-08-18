const { AttachmentBuilder, EmbedBuilder } = require('discord.js')
const Logger = require(`../../Utils/Logger`);
const prefix = 't!';

module.exports = {
    name: 'guildCreate',
    once: false,
    async execute(client, guild) {
        // Création d'un rôle "Warn"
        const db = client.db;
        guild.roles
            .create({
                name: '⛔ Avertissement',
                color: [185, 187, 190],
                reason: 'Rôle pour les personnes recevant un avertissement',
            })
            .then(
                role => {
                    role = guild.roles.cache.find(role => role.name === '⛔ Avertissement');
                    db.query(`SELECT * FROM serveur WHERE guildID = ${guild.id}`, async (err, req) => {
                        if (req.length < 1) {
                            let sql = `INSERT INTO serveur (guildID, prefix, troll, purcent_troll, raid, warn_role, claim) VALUES (${guild.id}, '${prefix}', 'off', '20', 'off', ${role.id}, '300')`
                            db.query(sql, function (err) {
                                if (err) throw err;
                            })
                        }
                        else {
                            db.query(`UPDATE serveur SET warn_role = ${role.id} WHERE guildID = ${guild.id}`);
                        }
                    })
                })
            .catch(console.error);

        // Message de Grodou quand il arrive sur un nouveau serveur
        const thumbnail = new AttachmentBuilder(`./Img/smiles/grodouSmile.png`, { name: `miniature.png` });
        let joinEmbed = new EmbedBuilder()
            .setColor(client.color)
            .setTitle("Oh, bien le bonjour, merci pour l'invitation ! 👋")
            .setThumbnail(`attachment://${thumbnail.name}`)
            .setDescription(`Je m'appelle ${client.user} et je suis le Maître de la Guilde de Grodoudou. Enchanté ! Bon, sur Discord, je suis avant tout un **client polyvalent** ayant pour but d'aider quant à la gestion du serveur.\n\nJe possède tout un tas de commandes très chouettes, pour sûr ! Elles sont toutes visibles en faisant \`/help\`. Je ne fonctionne qu'en ***slashcommands*** !\n\nPour que je fonctionne correctement, **n'oublie pas d'écrire au moins un message après mon arrivée** pour que j'enregistre ton serveur dans ma base de données (sinon je vais être tout cassé...) !\n\n**Il m'arrive aussi de dire tout un tas de bêtises mais ça, c'est une autre histoire... <:grodou3:903378318362017803> A bientôt sur ${guild.name} !**`)
            .setTimestamp()
            .setFooter({ text: client.embedFooter, iconURL: client.embedFootIcon });

        if (guild.systemChannelId !== null) {
            Logger.client(` —  ${client.user.username} a été ajouté au serveur « ${guild.name} » !`);
            return guild.systemChannel.send({ embeds: [joinEmbed], files: [thumbnail] })
        }
        else {
            const channel = guild.channels.cache.find(channel => channel.type === 0)
            Logger.client(` —  ${client.user.username} a été ajouté au serveur « ${guild.name} » !`);
            channel.send({ embeds: [joinEmbed] })
        }
    }
}
const { EmbedBuilder, AttachmentBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    name: 'invite',
    category: "Informations",
    permissions: ['SEND_MESSAGES'],
    ownerOnly: false,
    usage: 'invite',
    examples: ['invite'],
    description: "Je te donne la clé pour m'inviter chez toi !",
    async runInteraction(client, interaction) {
        const btnLink = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setURL(`https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands`)
                    .setStyle(ButtonStyle.Link)
                    .setLabel(`Inviter ${client.user.username}`),

                new ButtonBuilder()
                    .setURL("https://discord.gg/rT277n7")
                    .setStyle(ButtonStyle.Link)
                    .setLabel(`Serveur support`),

                new ButtonBuilder()
                    .setURL("https://www.eternia.fr")
                    .setStyle(ButtonStyle.Link)
                    .setLabel(`Eternia (site web)`),
            )

        const thumbnail = new AttachmentBuilder(`./Img/smiles/grodouWut.png`, { name: `miniature.png` });
        const Embed = new EmbedBuilder()
            .setAuthor({ name: `Ajouter ${client.user.username} sur son serveur !`, iconURL: 'https://cdn.discordapp.com/emojis/897582796434985031.png' })
            .setTitle(`Salut à toi ${interaction.user.tag} !`)
            .setColor(client.color)
            .setDescription(`Hello ! Ma dernière mise en ligne date d'<t:${parseInt(client.readyTimestamp / 1000)}:R> !`)
            .setThumbnail(`attachment://${thumbnail.name}`)
            .setDescription(`◽️ Ajoute-moi à ton serveur si tu me trouves drôle et intéressant, ou si tu veux simplement un allié pour t'aider niveau modération !\n◽️ Je t'attends impatiemment, on va bien s'amuser, tu vas voir... <:groAH2:523441414307315723> !\n\n<:grodou1:903378318387191818> <:pomme_parfaite:1005238649941659758> <:pomme_parfaite:1005238649941659758> <:pomme_parfaite:1005238649941659758> <:pomme_parfaite:1005238649941659758> <:pomme_parfaite:1005238649941659758>\nㅤ`)
            .setTimestamp()
            .setFooter({
                text: client.embedFooter,
                iconURL: client.embedFootIcon,
            });
        interaction.reply({ embeds: [Embed], files: [thumbnail], components: [btnLink] })
    }
}
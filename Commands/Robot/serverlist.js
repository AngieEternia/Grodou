const { EmbedBuilder } = require('discord.js')

module.exports = {
    name: 'serverlist',
    category: "Informations",
    permissions: ['SEND_MESSAGES'],
    ownerOnly: false,
    usage: 'serverlist',
    examples: ['serverlist'],
    description: "Je t'indique tous les serveurs où j'ai été ajoutés !",
    async runInteraction(client, interaction) {
        // On crée les différentes variables nécessaires
        let i = 0;

        // On crée l'embed
        let Embed = new EmbedBuilder()
            .setColor(client.color)
            .setAuthor({ name: `Les différents serveurs où je me trouve !`, iconURL: 'https://cdn.discordapp.com/emojis/897582796434985031.png' })
            .setDescription(`Un peu curieux ? Voici tous les serveurs où je me trouve actuellement ! Il y en a **${client.guilds.cache.size}** <:grodou1:903378318387191818> !`)
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true })).setTimestamp()
            .setFooter({ text: client.embedFooter, iconURL: client.embedFootIcon });

        // On ajoute avec une boucle tous les serveurs
        client.guilds.cache.forEach(guild => {
            let user = client.users.cache.find(user => user.id === guild.ownerId) // le propriétaire du serveur en question
            i++
            Embed.addFields([
                {
                    name: `N°${i} ┋ ${(guild.name).toUpperCase()} ┋ <:owner:997855833247449179> : ${user.username}`,
                    value: `\`\`\`js\nMembre${guild.memberCount > 1 ? "s" : ""} : ${guild.memberCount} ┋ ID : (${guild.id})\`\`\``
                }
            ])
        })

        // On envoie le tout !
        interaction.reply({ embeds: [Embed] })
    }
}
const { AttachmentBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'snipe',
    category: "Modération",
    permissions: ['ManageMessages'],
    ownerOnly: false,
    usage: 'snipe',
    examples: ['snipe'],
    description: "Je révèle le dernier message supprimé dans le salon...!",
    async runInteraction(client, interaction) {
        let msg = await client.snipe.get(interaction.channel.id)

        if(!msg) return interaction.reply({content: `Par la barbe d'Alakazam, il n'y a pas eu de messages supprimés récemment ici !`, ephemeral: true})
        
        const thumbnail = new AttachmentBuilder(`./Img/emotes/grodou2.png`, {name: `miniature.png`});
        let embed = new EmbedBuilder()
        .setColor(client.color)
        .setTitle(`Eh bah alors ${msg.author.tag}, on assume pas ?`)
        .setThumbnail(`attachment://${thumbnail.name}`)
        .setDescription(`Hey tout le monde ! Y'a **${msg.author.username}** qui avait posté un truc et qui l'a supprimé... Bouuuuh ! Pas de pomme pour la peine !\n\n**Date :** <t:${Math.floor(msg.createdAt / 1000)}:F>\n**Contenu :** ${msg.content === "" ? "" : `\`\`\`${msg.content}\`\`\``}`)
        .setImage(msg.attachments?.first()?.proxyURL)

        await interaction.reply({embeds: [embed], files: [thumbnail]})
    }
}
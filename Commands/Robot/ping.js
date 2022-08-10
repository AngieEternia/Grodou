const { EmbedBuilder, AttachmentBuilder } = require('discord.js')

module.exports = {
    name: 'ping',
    category: "Robot",
    permissions: ['SendMessages'],
    ownerOnly: false,
    usage: 'ping',
    examples: ['ping'],
    description: "Test de QI pour tester mon intelligence et ma rapidité d'exécution !",
    async runInteraction(client, interaction) {
        const startTimeDB = Date.now();
        const db = client.db
        db.query(`SELECT * FROM serveur WHERE guildID = ${interaction.guild.id}`, async (err, req) => {
            const endTimeDB = Date.now()
            const tryPong = await interaction.reply({ content: `Bouge pas mon Psykokwak, je calcule ça...`, fetchReply: true })
            const thumbnail = new AttachmentBuilder(`./Img/smiles/grodouWut.png`, { name: `miniature.png` });
            const embed = new EmbedBuilder()
                .setAuthor({ name: 'Résultats pour les différents tests de latence de...', iconURL: 'https://cdn.discordapp.com/emojis/897582796434985031.png' })
                .setColor(client.color)
                .setDescription(`Hello ! Ma dernière mise en ligne date d'<t:${parseInt(client.readyTimestamp / 1000)}:R> !`)
                .setThumbnail(`attachment://${thumbnail.name}`)
                .addFields([
                    { name: "◽️ Grodou", value: `\`\`\`${tryPong.createdTimestamp - interaction.createdTimestamp}ms\`\`\``, inline: true },
                    { name: "◽️ API Discord", value: `\`\`\`${client.ws.ping}ms\`\`\``, inline: true },
                    { name: "◽️ Database", value: `\`\`\`${endTimeDB - startTimeDB}ms\`\`\``, inline: true },
                ])
                .setTimestamp()
                .setFooter({
                    text: client.embedFooter,
                    iconURL: client.embedFootIcon,
                });
            interaction.editReply({ content: null, embeds: [embed], files: [thumbnail] })
        })
    }
}
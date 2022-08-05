const { MessageEmbed, MessageAttachment } = require('discord.js')

module.exports = {
    name: 'ping',
    category: "Informations",
    permissions: ['SEND_MESSAGES'],
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
            const thumbnail = new MessageAttachment(`./Img/smiles/grodouWut.png`, `miniature.png`);
            const embed = new MessageEmbed()
                .setTitle('<:grodoueyes:897582796434985031>  Résultats pour les différents tests de latence de...')
                .setDescription(`Hello ! Ma dernière mise en ligne date d'<t:${parseInt(client.readyTimestamp / 1000)}:R> !`)
                .setThumbnail(`attachment://${thumbnail.name}`)
                .addFields(
                    { name: "◽️ Grodou", value: `\`\`\`${tryPong.createdTimestamp - interaction.createdTimestamp}ms\`\`\``, inline: true },
                    { name: "◽️ API Discord", value: `\`\`\`${client.ws.ping}ms\`\`\``, inline: true },
                    { name: "◽️ Database", value: `\`\`\`${endTimeDB - startTimeDB}ms\`\`\``, inline: true },
                )
                .setTimestamp()
                .setFooter({
                    text: client.embedFooter,
                    iconURL: client.embedFootIcon,
                });
            interaction.editReply({ content: null, embeds: [embed], files: [thumbnail] })
            console.log(interaction.guild.channels.cache.filter((c) => c.type === "GUILD_TEXT").size)
        })
    }
}
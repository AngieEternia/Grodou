const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'eval',
    category: "Administration",
    permissions: ['ADMINISTRATOR'],
    ownerOnly: false,
    usage: 'eval [code]',
    examples: ['eval Discord.Permissions.FLAGS'],
    description: "Je fouille dans les tréfonds de la librairie « discord.js » pour évaluer un code !",
    options: [
        {
            name: 'code',
            description: 'Le code à évaluer',
            type: ApplicationCommandOptionType.String,
            required: true,
        }
    ],
    async runInteraction(client, interaction) {
        const code = interaction.options.getString("code");

        try {

            let output = eval(code)
            if (typeof output !== 'string') output = require("util").inspect(output, { depth: 0 })

            if (output.includes(client.token)) return interaction.reply(`Non mais tu m'fais quoi là, ${interaction.user} ?! J'vais pas mettre mon **token** ici, ça va pas bien ! <:grodouNO:520329945168347157>`)

            let embed = new EmbedBuilder()
                .setColor(client.color)
                .setTitle(`Évaluation d'un code`)
                .setDescription(`Code donné : \`\`\`js\n${code}\`\`\`\nCode reçu : \`\`\`js\n${output}\`\`\``)
                .setTimestamp()
                .setFooter({ text: client.embedFooter, iconURL: client.embedFootIcon });

            interaction.reply({ embeds: [embed] })

        } catch (err) {

            let embed = new EmbedBuilder()
                .setColor(client.color)
                .setTitle(`Évaluation d'un code`)
                .setDescription(`Code donné : \`\`\`js\n${code}\`\`\`\nCode reçu : \`\`\`js\n${err}\`\`\``)
                .setTimestamp()
                .setFooter({ text: client.embedFooter, iconURL: client.embedFootIcon });

            interaction.reply({ embeds: [embed] })

        }
    }
}
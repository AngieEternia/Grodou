const { ApplicationCommandOptionType, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'poll',
    category: "Informations",
    permissions: ['SendMessages'],
    defaultMemberPermissions: PermissionFlagsBits.SendMessages,
    ownerOnly: false,
    usage: 'poll [question] [choix1|choix2|choix3...]',
    examples: ['poll [Thème du prochain Kahoot ?] [Principaux|Animé|Manga]'],
    description: "Je t'aide à créer ton propre sondage !",
    options: [
        {
            name: 'question',
            description: 'Tapez la question de votre sondage',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: 'options',
            description: 'Les différents choix de votre sondage, séparés par |',
            type: ApplicationCommandOptionType.String,
            required: true,
        }
    ],
    async runInteraction(client, interaction) {
        const pollTitle = interaction.options.getString('question');
        let pollContent = interaction.options.getString('options');

        pollContent = pollContent.split("|");

        if (pollContent.length < 2 || pollContent.length > 25) return interaction.reply({
            embeds: [{
                color: "RED",
                title: "❌ Choix invalides",
                description: "Vous devez indiquer __au minimum 2 choix__ de réponse et __au maximum 25__. Vous devez les séparer avec le caractère **|**.`"
            }], ephemeral: true
        });

        let alphabet = ["🇦", "🇧", "🇨", "🇩", "🇪", "🇫", "🇬", "🇭", "🇮", "🇯", "🇰", "🇱", "🇲", "🇳", "🇴", "🇵", "🇶", "🇷", "🇸", "🇹", "🇺", "🇻", "🇼", "🇽", "🇾", "z"]
        let optionLines = ""
        for (let i = 0; i < pollContent.length; i++) {
            optionLines += `${alphabet[i]} **${pollContent[i].toString().trim()}**\n\n`
        }

        const embed = new EmbedBuilder()
            .setTitle(pollTitle)
            .setColor(client.color)
            .setDescription(optionLines)
            .setTimestamp()
            .setFooter({ text: `Nouveau sondage généré par ${interaction.user.tag} !` })

        const poll = await interaction.reply({ embeds: [embed], fetchReply: true })
        for (let i = 0; i < pollContent.length; i++) {
            poll.react(alphabet[i])
        }
    }
}
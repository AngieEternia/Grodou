const { ApplicationCommandOptionType } = require("discord.js")
const { EmbedBuilder } = require("discord.js")

module.exports = {
    name: 'date',
    category: "Informations",
    permissions: ['SendMessages'],
    ownerOnly: false,
    usage: 'date',
    examples: ['date'],
    description: "J'me demande souvent quel jour on est...",

    async runInteraction(client, interaction) {
        const d = new Date();

        function formatDate() {
            let month = d.getMonth();
            let day = (d.getDate() === 1) ? `${d.getDate()}er` : d.getDate();
            let year = d.getFullYear();
            let jour = d.getUTCDay();
            const listeMois = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
            const moisLettres = listeMois[month];
            const listeJours = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi']
            const jourLettre = listeJours[jour];
            return [jourLettre, day, moisLettres, year].join(' ');
        }

        function formatHeure() {
            let hour = d.getHours();
            let minute = d.getMinutes();
            let second = d.getSeconds();
            return [hour, minute, second].join(":");
        }

        const embed = new EmbedBuilder()
            .setAuthor({ name: 'Au quatrième top, il sera...', iconURL: 'https://cdn.discordapp.com/emojis/897582796434985031.png' })
            .setColor(client.color)
            .setDescription(`> 📆  **${formatDate()}**\n> ⏲️  **${formatHeure()}**`)
            .setFooter({
                text: 'BIP - BIP - BIP - BIP',
                iconURL: client.embedFootIcon,
            });

        await interaction.reply({ embeds: [embed] });

    }
}
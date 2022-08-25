const { ApplicationCommandOptionType, PermissionFlagsBits, EmbedBuilder } = require("discord.js")
const fetch = require("node-fetch")
const cheerio = require("cheerio")

const jeuxPoké = require(`../../Json/defispokemon.json`);
let listJeux = [];
for (const jeux of jeuxPoké.liste) {
    listJeux.push({ name: jeux.name, value: jeux.name });
}

module.exports = {
    name: 'defis',
    category: "Pokémon",
    permissions: ['SendMessages'],
    defaultMemberPermissions: PermissionFlagsBits.Administrator,
    ownerOnly: true,
    usage: 'defis [nom du jeu]',
    examples: ['defis Pokémon Rouge'],
    description: "Envie de refaire un jeu Pokémon avec des petits défis ? C'est par ici !",
    options: [
        {
            name: "jeu",
            description: "Le jeu sur lequel vous souhaitez faire des défis",
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: listJeux
        },
        {
            name: "nombre",
            description: "Le nombre de défis à tirer au sort",
            type: ApplicationCommandOptionType.Number,
            required: true,
            minValue: 1,
            maxValue: 10
        }
    ],

    async runInteraction(client, interaction) {
        const gameChoice = interaction.options.getString('jeu'); // le nom du jeu récupéré dans le choice
        const number = interaction.options.getNumber('nombre'); // le nom du jeu récupéré dans le choice        

        const gameFile = require(`../../Json/jeux_defis/pokemonrubissaphiretemeraude.json`); // le fichier associé

        function getMultipleRandom(keys, num) {
            const shuffled = [...keys].sort(() => 0.5 - Math.random());

            return shuffled.slice(0, num);
        }

        let keys = []
        for (const element of gameFile.liste) {
            keys = Object.keys(element.defis)
        }
        console.log(keys.length)
        const test = getMultipleRandom(keys, number);
        console.log(test)

        let description = "";
        for (let i = 0; i < test.length; i++) {
            description += "🔸 " + test[i] + "\n\n"
            console.log(test[i])
        }

        const embed = new EmbedBuilder()
            .setColor(client.color)
            .setTitle("Test tirage avec RSE")
            .setDescription(description);

        await interaction.reply({ embeds: [embed] });
    }
}
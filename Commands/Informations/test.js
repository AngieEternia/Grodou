const { ApplicationCommandOptionType, PermissionFlagsBits } = require("discord.js")
const os = require('os');

const jeuxPoké = require(`../../Json/jeuxpokemon.json`);
let listJeux = [];
for (const jeux of jeuxPoké.liste) {
    listJeux.push({ name: jeux.name, value: jeux.name });
}



module.exports = {
    name: 'test',
    category: "Informations",
    permissions: ['Administrator'],
    defaultMemberPermissions: PermissionFlagsBits.Administrator,
    ownerOnly: false,
    usage: 'test',
    examples: ['test'],
    description: "Ceci est un test",
    options: [
        {
            name: "jeu",
            description: "Le jeu sur lequel vous souhaitez avoir des informations",
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: listJeux
        }
    ],

    async runInteraction(client, interaction) {
        //console.log(process.version, os.arch(), os.cpus(), os.cpus().length, os.version(), os.type(), os.freemem())


        //const result = Object.entries(element.keywords).find(el => el[1].includes(motclé.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")));
        let categoryGame = [];
        const gameFile = require(`../../Json/jeux_motscles/pokemonecarlateetviolet copy.json`);
        for (const element of gameFile.keys(keywords)) {
            console.log(element)
        }

    }
}
const { ApplicationCommandOptionType, EmbedBuilder } = require("discord.js")
const os = require('os');

module.exports = {
    name: 'test',
    category: "Informations",
    permissions: ['SendMessages'],
    ownerOnly: false,
    usage: 'test',
    examples: ['test'],
    description: "Ceci est un test",
    options: [
        {
            name: 'utilisateur',
            description: 'Le membre à avertir',
            type: ApplicationCommandOptionType.User,
            required: true
        }
    ],

    async runInteraction(client, interaction) {
        //console.log(process.version, os.arch(), os.cpus(), os.cpus().length, os.version(), os.type(), os.freemem())

        const db = client.db;

        const target = interaction.options.getMember('utilisateur');

        db.query(`SELECT * FROM warns WHERE guildID = '${interaction.guild.id}' AND userID = ${target.id}`, async (err, req) => {
            console.log(req.length);
        })


    }
}
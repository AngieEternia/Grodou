const { PermissionFlagsBits, ApplicationCommandOptionType, AttachmentBuilder } = require('discord.js');
const { createCanvas, loadImage } = require('canvas');

module.exports = {
    name: 'time',
    category: "Pokémon",
    permissions: ['SendMessages'],
    defaultMemberPermissions: PermissionFlagsBits.SendMessages,
    ownerOnly: false,
    usage: 'time [nom du jeu]',
    examples: ['time écarlate'],
    description: "Je te dis dans combien de jours sort le jeu que tu as sélectionné dans la liste !",
    options: [
        {
            name: "jeu",
            description: "Le jeu dont vous voulez savoir le nombre de jours avant sa sortie",
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [
                {
                    name: 'Pokémon Écarlate et Violet',
                    value: 'Pokémon Écarlate et Violet'
                },
                {
                    name: 'Pokémon Sleep',
                    value: 'Pokémon Sleep'
                }
            ]
        },
    ],
    async runInteraction(client, interaction) {
        const gameChoices = interaction.options.getString('jeu');
        const imageName = gameChoices.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replaceAll(/[^a-zA-Z0-9_-]/g, '');
        const d = new Date();
        let dayCaR, hourCaR, minuteCaR, secondCaR;
        function formatDate() {
            let month = d.getMonth();
            let day = (d.getDate() === 1) ? `${d.getDate()}er` : d.getDate();
            let year = d.getFullYear();
            const listeMois = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
            const moisLettres = listeMois[month];
            return [day, moisLettres, year].join(' ');
        }
        function msToDay(ms) {
            ms = Number(ms / 1000);
            const d = Math.floor(ms / (3600 * 24));
            return d;
        }
        function msToHour(ms) {
            ms = Number(ms / 1000);
            const h = Math.floor(ms % (3600 * 24) / 3600);
            return h;
        }
        function msToMinute(ms) {
            ms = Number(ms / 1000);
            const m = Math.floor(ms % 3600 / 60);
            return m;
        }
        function msToSecond(ms) {
            ms = Number(ms / 1000);
            const s = Math.floor(ms % 60);
            return s;
        }


        const canvas = createCanvas(1000, 250);
        const ctx = canvas.getContext(`2d`);
        const background = await loadImage(`./Img/jeux/${imageName}.png`);
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
        const compteArebours = await loadImage(`./Img/jeux/car.png`);
        ctx.drawImage(compteArebours, 0, 0, 1000, 250);
        // Nombre de jour restants
        ctx.font = `85px Futura LtCn BT`;
        ctx.textAlign = 'center';
        ctx.fillStyle = `#fff`;
        
        if (gameChoices == 'Pokémon Écarlate et Violet') {
            const j_ecvi = new Date("11/18/2022");
            const jours = (j_ecvi.getTime() - d.getTime()) / (1000 * 3600 * 24) + 1;
            const decompte = Math.floor(jours);

            if (j_ecvi - d < 0) { dayCaR = "--"; hourCaR = "--"; minuteCaR = "--"; secondCaR = "--"; }
            else {
                dayCaR = msToDay(j_ecvi - d) < 10 ? `0${msToDay(j_ecvi - d)}` : msToDay(j_ecvi - d);
                hourCaR = msToHour(j_ecvi - d) < 10 ? `0${msToHour(j_ecvi - d)}` : msToHour(j_ecvi - d);
                minuteCaR = msToMinute(j_ecvi - d) < 10 ? `0${msToMinute(j_ecvi - d)}` : msToMinute(j_ecvi - d);
                secondCaR = msToSecond(j_ecvi - d) < 10 ? `0${msToSecond(j_ecvi - d)}` : msToSecond(j_ecvi - d);
            }
            ctx.fillText(dayCaR, 334, 100);
            ctx.fillText(hourCaR, 446, 100);
            ctx.fillText(minuteCaR, 555, 100);
            ctx.fillText(secondCaR, 663, 100);
            const attachment = new AttachmentBuilder(canvas.toBuffer(), `comptearebours.png`);

            await interaction.reply({ content: `Oh, nous sommes le ${formatDate()} et il ne reste que...\n**${decompte} jours** avant la sortie de **${gameChoices}**, pour sûr !`, files: [attachment] })
        }
        else if (gameChoices == 'Pokémon Sleep') {
            dayCaR = "??"; hourCaR = "??"; minuteCaR = "??"; secondCaR = "??";
            ctx.fillText(dayCaR, 334, 100);
            ctx.fillText(hourCaR, 446, 100);
            ctx.fillText(minuteCaR, 555, 100);
            ctx.fillText(secondCaR, 663, 100);
            const attachment = new AttachmentBuilder(canvas.toBuffer(), `comptearebours.png`);
            await interaction.reply({ content: `Oh, nous sommes le ${formatDate()} et on ne sait toujours pas quand va sortir ${gameChoices} !`, files: [attachment] })
        }
    }
}
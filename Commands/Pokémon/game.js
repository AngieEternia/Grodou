const { ApplicationCommandOptionType, PermissionFlagsBits, EmbedBuilder, AttachmentBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js")
const fetch = require("node-fetch")
const cheerio = require("cheerio")

const jeuxPoké = require(`../../Json/jeuxpokemon.json`);
let listJeux = [];
for (const jeux of jeuxPoké.liste) {
    listJeux.push({name:jeux.name, value:jeux.name});
}

let btn = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
            .setCustomId('retour')
            .setEmoji('◀️')
            .setStyle(ButtonStyle.Primary),

        new ButtonBuilder()
            .setCustomId('cancel')
            .setEmoji('<:ad_cancel:979738900526419999>')
            .setStyle(ButtonStyle.Danger),

        new ButtonBuilder()
            .setCustomId('suivant')
            .setEmoji('▶️')
            .setStyle(ButtonStyle.Primary),
    )

module.exports = {
    name: 'game',
    category: "Pokémon",
    permissions: ['SendMessages'],
    defaultMemberPermissions: PermissionFlagsBits.SendMessages,
    ownerOnly: false,
    usage: 'game [nom du jeu] [motclé|liste|list]',
    examples: ['game écarlate liste', 'game rouge pokédex'],
    description: "Besoin d'une info sur un jeu Pokémon ? Pas de souci, c'est par ici !",
    options: [
        {
            name: "jeu",
            description: "Le jeu sur lequel vous souhaitez avoir des informations",
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: listJeux
        },
        {
            name: "motclé",
            description: `Le mot-clé pour chercher un article || "liste" ou "list" donne la liste des mots-clés`,
            type: ApplicationCommandOptionType.String,
            required: true,
            autocomplete: true
        },
    ],

    async runInteraction(client, interaction) {
        // Fonction pour tronquer la description de l'embed
        function limit(str, limit, end) {
            limit = (limit) ? limit : 100;
            end = (end) ? end : '[...]';
            str = str.split(' ');

            if (str.length > limit) {
                var cutTolimit = str.slice(0, limit);
                return cutTolimit.join(' ') + ' ' + end;
            }
            return str.join(' ');
        }

        const gameChoice = interaction.options.getString('jeu'); // le nom du jeu récupéré dans le choice
        const motclé = interaction.options.getString('motclé'); // le mot-clé
        const gameChoiceNormalize = gameChoice.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replaceAll(/[^a-zA-Z0-9_-]/g, ''); // on normalise le jeu
        const gameFile = require(`../../Json/jeux_motscles/${gameChoiceNormalize}.json`); // le fichier associé

        let erreurEmbed = new EmbedBuilder()
            .setColor("#ff0000")
            .setTimestamp()
            .setFooter({ text: client.embedFooter, iconURL: client.embedFootIcon });

        for (const element of gameFile.liste) {
            // La liste des mots-clés qui existent
            const keywords = Object.values(element.keywords).toString().replaceAll(",", " - ");
            const keywordsNumber = keywords.split(" - ");
            const keywordsDico = []; // Un array contenant tous les mots clés
            for (let i = 0; i < keywordsNumber.length; i++) { keywordsDico.push(keywordsNumber[i]) }
            // Délimiteur de catactères
            const discordMaxChars = 300;
            const manyToSplit = [[]];
            const joinChars = "\` - \`";
            let index = 0;
            keywordsNumber.map(e => {
                if (manyToSplit[index].length + joinChars.length * manyToSplit[index].length + e.length > discordMaxChars) {
                    index++;
                    manyToSplit.push([e]);
                } else {
                    manyToSplit[index].push(e);
                }
            });

            const result = Object.entries(element.keywords).find(el => el[1].includes(motclé.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")));

            // Si le mot-clé n'existe pas et est différent de liste/list
            if (!keywordsDico.includes(motclé) && !["liste", "list"].includes(motclé)) {
                const erreur = "Ce mot-clé n'existe pas !"
                erreurEmbed.setAuthor({ name: erreur.toUpperCase(), iconURL: "https://cdn.discordapp.com/emojis/979484974443028480.png" })
                erreurEmbed.setDescription(
                    [
                        `Le mot-clé \`${motclé}\` n'est pas valide !`,
                        `**${element.truename}** ${element.truename.includes(" et ") ? "possèdent" : "possède"} \`${keywordsNumber.length} ${keywordsNumber.length > 1 ? "mots-clés" : "mot-clé"}\`.`,
                        `Un système d'auto-complétion est disponible sur cette commande.`,
                        `Vous pouvez également indiquer \`list\` ou \`liste\` pour avoir la liste des mots-clés.`
                    ].join('\n')
                )
                return interaction.reply({ embeds: [erreurEmbed], fetchReply: true })
            }
            // Si le mot-clé est liste/list
            else if (["liste", "list"].includes(motclé)) {
                const infos = `Mots-clés disponibles pour ${element.truename}`; // Titre de l'embed
                const keywordListEmbeds = []; // Tableau des embeds
                const imageName = ((element.truename).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replaceAll(/[^a-zA-Z0-9_-]/g, '')); // nom image
                const attachment = new AttachmentBuilder(`./Img/jeux/${imageName}.png`, { name: `${imageName}.png` }); // image attachée

                // On itère sur tous les champs de mots clés
                for (let i = 0; i < manyToSplit.length; i++) {
                    const keywordList = manyToSplit[i]
                    const caracters = keywordList.join(joinChars) // Rejoint tous les mots clés avec un délimiteur

                    const keywordListEmbed = new EmbedBuilder()
                        .setColor("#3ba55d")
                        .setAuthor({
                            name: infos.toUpperCase(),
                            iconURL: "https://cdn.discordapp.com/emojis/982699120378642483.png"
                        })
                        .addFields({
                            name: `${keywordsNumber.length} ${keywordsNumber.length > 1 ? "mots-clés enregistrés" : "mot-clé enregistré"} - Page ${i + 1}`,
                            value: `\`${caracters}\``
                        })
                        .setImage(`attachment://${attachment.name}`)
                        .setFooter({ text: `Page ${i + 1} sur ${manyToSplit.length} ┋ Liste des mots-clés ┋ ${client.embedFooter}`, iconURL: client.embedFootIcon });
                    keywordListEmbeds.push(keywordListEmbed)
                }
                // On affiche en fonction du nombre de pages !
                if (keywordListEmbeds.length === 1) { // s'il n'y a qu'une seule page
                    await interaction.reply({ embeds: [keywordListEmbeds[0]], files: [attachment], fetchReply: true })
                } else if (keywordListEmbeds.length > 1) { // s'il y en a plusieurs
                    let indexPage = 0; // La page où on se trouve
                    await interaction.reply({ embeds: [keywordListEmbeds[indexPage]], components: [btn], files: [attachment], fetchReply: true });
                    let filter = async () => true;
                    const collector = interaction.channel.createMessageComponentCollector({ filter, time: 120000 })

                    collector.on("collect", async button => {
                        if (button.user.id !== interaction.user.id) return button.reply({ content: "Bah non, tu ne peux pas faire ça, t'es pas l'auteur du message !", ephemeral: true });

                        if (button.customId === "retour" && indexPage === 0) { // Pour boucler sur la page de fin
                            indexPage += (keywordListEmbeds.length - 1); // Ajoute 1 à l'index page
                            await interaction.editReply({ embeds: [keywordListEmbeds[keywordListEmbeds.length - 1]] });
                            button.deferUpdate();
                        }
                        else if (button.customId === "suivant" && indexPage === (keywordListEmbeds.length - 1)) { // Pour boucler sur la page initiale
                            indexPage -= keywordListEmbeds.length - 1; // Ajoute 1 à l'index page
                            await interaction.editReply({ embeds: [keywordListEmbeds[0]] });
                            button.deferUpdate();
                        }
                        else if (button.customId === "suivant" && indexPage < keywordListEmbeds.length - 1) { // Si on a pas atteint la fin
                            indexPage += 1; // Ajoute 1 à l'index page
                            await interaction.editReply({ embeds: [keywordListEmbeds[indexPage]] });
                            button.deferUpdate();
                        }
                        else if (button.customId === "retour" && indexPage > 0) { // Si ce n'est pas la première page 
                            indexPage -= 1; // Retire 1 à l'index page
                            await interaction.editReply({ embeds: [keywordListEmbeds[indexPage]] });
                            button.deferUpdate();
                        }
                        else return await collector.stop();
                    })

                    collector.on("end", async () => {
                        await interaction.editReply({ embeds: [keywordListEmbeds[indexPage]], components: [], fetchReply: true });
                    })

                } else return;
            }
            // Si le mot-clé fait partie de la liste
            else {
                const keywordsResult = (result.toString().split(','))[0]
                const urlPage = keywordsResult;
                fetch(urlPage)
                    .then(res => res.text())
                    .then(async html => {
                        const $ = cheerio.load(html)
                        const title = $("title").text();
                        const content = $("main").find("br").replaceWith("\n\n").end().text();
                        const imageName = ((element.truename).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replaceAll(/[^a-zA-Z0-9_-]/g, ''))
                        const attachment = new AttachmentBuilder(`./Img/jeux/${imageName}.png`, { name: `${imageName}.png` });

                        let Embed = new EmbedBuilder()
                            .setColor(client.color)
                            .setTitle(title)
                            .setURL(urlPage)
                            .setDescription(limit(content, 60))
                            .setImage(`attachment://${attachment.name}`)
                            .setTimestamp()
                            .setFooter({ text: client.embedFooter, iconURL: client.embedFootIcon });

                        await interaction.reply({
                            content: `**Voici la page retournée pour le mot-clé \`${motclé}\` de \`${element.truename}\` :**\n➡️ ${urlPage}\n`,
                            embeds: [Embed],
                            files: [attachment]
                        });
                    })
            }
        }
    },

    async runAutocomplete(client, interaction) {
        const gameChoice = interaction.options.getString('jeu'); // le nom du jeu récupéré dans le choice
        const gameChoiceNormalize = gameChoice.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replaceAll(/[^a-zA-Z0-9_-]/g, ''); // on normalise le jeu
        const gameFile = require(`../../Json/jeux_motscles/${gameChoiceNormalize}.json`); // le fichier associé
        const keywordsDico = []; // Un array contenant tous les mots clés

        // On lance la boucle
        for (const element of gameFile.liste) {
            // La liste des mots-clés qui existent
            const keywords = Object.values(element.keywords).toString().replaceAll(",", " - ");
            const keywordsNumber = keywords.split(" - ");
            for (let i = 0; i < keywordsNumber.length; i++) { keywordsDico.push(keywordsNumber[i]) }
        }
        const focusedOption = interaction.options.getFocused(true);
        const choices = keywordsDico;
        if (!choices) return;
        const filtered = choices.filter(choice => choice.includes(focusedOption.value.toLowerCase()));
        const filteredLimit = filtered.slice(0, 15);
        await interaction.respond(filteredLimit.map(choice => ({ name: choice, value: choice })));
    }
}
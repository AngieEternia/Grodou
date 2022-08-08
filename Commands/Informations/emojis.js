const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js")

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
    name: 'emojis',
    category: "Informations",
    permissions: ['SEND_MESSAGES'],
    ownerOnly: false,
    usage: 'emojis',
    examples: ['emojis'],
    description: "Je te montre tous les emojis disponibles sur le serveur !",

    async runInteraction(client, interaction) {
        // On récupère les emojis et on les push dans un tableau avec .map()
        const emojis = interaction.guild.emojis.cache.map((e) => `${e} - \`:${e.name}:\` (<t:${Math.floor(e.createdAt / 1000)}:D>)`)

        // S'il y a des emojis personnalisé
        if (emojis.length) {
            // On définit le nombre max d'emojis à afficher par page de l'embed
            const maxEmotePage = 10; // valeur pouvant être modifiée
            const manyToSplit = [[]];
            let index = 0;

            // On push chaque résultat de "const emojis" dans un tableau de manyToSplit
            emojis.map(e => {
                if (manyToSplit[index].length + 1 > maxEmotePage) {
                    index++;
                    manyToSplit.push([e]);
                } else {
                    manyToSplit[index].push(e);
                }
            });

            // On crée un tableau qui va contenir les différents embeds pour la pagination
            const emoteListEmbeds = []

            // On itère sur tous les champs de mots clés
            for (let i = 0; i < manyToSplit.length; i++) {

                // Structure de l'embed de base
                const emoteListEmbed = new EmbedBuilder()
                    .setColor(client.color)
                    .setTitle(`Liste des emotes sur ${interaction.guild.name}`.toUpperCase())
                    .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
                    .addFields(
                        {
                            name: `${emojis.length} emote${emojis.length > 1 ? "s" : ""} - Page ${i + 1}`,
                            value: `${manyToSplit[i].join("\n")}`
                        }
                    )
                    .setFooter({ text: `Page ${i + 1} sur ${manyToSplit.length} ┋ Liste des emotes ┋ ${client.embedFooter}`, iconURL: client.embedFootIcon });
                emoteListEmbeds.push(emoteListEmbed)
            }

            // Si mon array d'embed ne contient qu'un seul embed
            if (emoteListEmbeds.length === 1) {
                await interaction.reply({ embeds: [emoteListEmbeds[0]], fetchReply: true })
            }
            // Sinon...
            else {
                // On crée un index pour savoir sur quelle page on se trouve
                let indexPage = 0;

                // On crée les boutons
                let msg = await interaction.reply({ embeds: [emoteListEmbeds[indexPage]], components: [btn], fetchReply: true })
                let filter = async () => true;

                const collector = interaction.channel.createMessageComponentCollector({ filter, time: 120000 })

                collector.on("collect", async button => {

                    if (button.user.id !== interaction.user.id) return button.reply({ content: "Bah non, tu ne peux pas faire ça, t'es pas l'auteur du message !", ephemeral: true })

                    if (button.customId === "retour" && indexPage === 0) { // Pour boucler sur la page de fin
                        indexPage += (emoteListEmbeds.length - 1) // Ajoute 1 à l'index page
                        interaction.editReply({ embeds: [emoteListEmbeds[emoteListEmbeds.length - 1]], fetchReply: true })
                        button.deferUpdate()
                    }
                    else if (button.customId === "suivant" && indexPage === (emoteListEmbeds.length - 1)) { // Pour boucler sur la page initiale
                        indexPage -= emoteListEmbeds.length - 1 // Ajoute 1 à l'index page
                        interaction.editReply({ embeds: [emoteListEmbeds[0]], fetchReply: true })
                        button.deferUpdate()
                    }
                    else if (button.customId === "suivant" && indexPage < emoteListEmbeds.length - 1) { // Si on a pas atteint la fin
                        indexPage += 1 // Ajoute 1 à l'index page
                        interaction.editReply({ embeds: [emoteListEmbeds[indexPage]], fetchReply: true })
                        button.deferUpdate()
                    }
                    else if (button.customId === "retour" && indexPage > 0) { // Si ce n'est pas la première page 
                        indexPage -= 1 // Retire 1 à l'index page
                        interaction.editReply({ embeds: [emoteListEmbeds[indexPage]], fetchReply: true })
                        button.deferUpdate()
                    }
                    else return await collector.stop()
                })

                collector.on("end", async () => {
                    return await interaction.editReply({ embeds: [emoteListEmbeds[indexPage]], components: [], fetchReply: true })
                })
            }
        }
        else {
            return await interaction.reply(`Aucun emoji personnalisé n'a été ajouté sur ${interaction.guild.name} !`)
        }
    }
}
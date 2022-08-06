const { ApplicationCommandOptionType, EmbedBuilder, AttachmentBuilder, ActionRowBuilder, SelectMenuBuilder } = require('discord.js')
const listOfCategory = require(`../../Json/categories.json`)

const contextDescription = {
    userinfo: "Je révèle toutes les infos à savoir sur un membre du serveur !",
    avatar: "Je te montre en gros l'avatar d'un membre du serveur !"
};

module.exports = {
    name: 'help',
    category: "Informations",
    permissions: ['SEND_MESSAGES'],
    ownerOnly: false,
    usage: 'help <command>',
    examples: ['help', 'help ping'],
    description: "J'affiche la liste des capacités que j'ai apprises !",
    options: [
        {
            name: "commande",
            description: "Tapez le nom de votre commande",
            type: ApplicationCommandOptionType.String,
            required: false,
            autocomplete: true
        },
    ],
    async runInteraction(client, interaction) {
        const prefix = "/";
        const cmdName = interaction.options.getString("commande");

        // S'il n'y a pas de commande en argument
        if (!cmdName) {
            // On récup les catégories dans le json
            const categories = [];
            for (const elem of listOfCategory.liste) {
                categories.push(elem)
            }
            let catEmbed = "";
            for (let i = 0; i < categories.length; i++) {
                catEmbed += categories[i].emoji + "  ⦙  " + categories[i].name + '\n\n'
            }

            // On récup le nom des commandes
            const commands = client.commands;
            const numberCommand = [];
            commands.forEach((command) => {
                numberCommand.push(command.name)
            });

            // L'embed général
            let descriptionEmbed = `> **◽️ Préfixe : \`${prefix}\`**\n> **◽️ Détails : \`${prefix}help <commande>\`** \n> ◽️ **Commandes : \`${numberCommand.length}\`**\n<:sep1:975384221138948126><:sep2:975384221239615528><:sep2:975384221239615528><:sep2:975384221239615528><:sep3:975384220849557545>\n\n**${catEmbed.toUpperCase()}**<:sep1:975384221138948126><:sep2:975384221239615528><:sep2:975384221239615528><:sep2:975384221239615528><:sep3:975384220849557545>`
            const menuEmbed = new EmbedBuilder()
                .setAuthor({ name: 'Liste des capacités apprises par Grodou', iconURL: 'https://cdn.discordapp.com/emojis/897582796434985031.png', url: 'http://discord.eternia.fr' })
                .setColor(client.color)
                .setTitle(`Bienvenue sur ma commande \`aide\` !`)
                .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                .setDescription(descriptionEmbed)
                .setTimestamp()
                .setFooter({ text: client.embedFooter, iconURL: client.embedFootIcon });

            let options = categories.map(category => ({
                label: (category.name).toUpperCase(),
                description: category.description,
                emoji: category.emoji,
                value: (category.position - 1).toString(),
            }))

            let optionDebut = {
                label: ("Retour à l'accueil").toUpperCase(),
                description: "Revenir à l'accueil du menu aide",
                emoji: '🏡',
                value: "accueil",
            };
            options.splice(0, 0, optionDebut); // on intercale cette option au tout début du array option

            let optionFin = {
                label: ("Fermer le menu").toUpperCase(),
                description: "Quitter le menu d'aide",
                emoji: '❌',
                value: "close",
            };
            options.push(optionFin) // On push cette option de fin à la fin de l'array option

            let actionRowComponent = new ActionRowBuilder()
                .addComponents(
                    new SelectMenuBuilder()
                        .setCustomId('select-menu')
                        .setPlaceholder("Choisissez la catégorie ci-dessous...")
                        .setOptions(options)
                );

            let msg = await interaction.reply({ embeds: [menuEmbed], components: [actionRowComponent], fetchReply: true })

            //On crée un array pour les commandes de chaque catégorie
            const listCommand = []
            // On trie et filtre, et on push dans le tableau
            categories.forEach((cat, i) => {
                let numberCat = commands.filter(c => c.category === cat.name)
                listCommand.push("> " + numberCat.map((cmd) => "◽️ **" + cmd.name + "** : " + (cmd.description ? cmd.description : contextDescription[cmd.name])).join("\n> "))
            });

            // On crée un array contenant les différents embeds pour la navigation
            const commandListEmbeds = [], listAttachments = [];

            // On itère sur tous les noms de catégories
            for (let i = 0; i < categories.length; i++) {
                const categoName = categories[i].emoji + " " + categories[i].name
                const categoImg = categories[i].name
                const nbCommand = listCommand[i].match(/>/gi).length

                // Petit array pour les minia par catégorie
                let catLink = (categoImg.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""))
                const thumb = new AttachmentBuilder(`./Img/help/g_${catLink.trim()}.png`, { name: `miniature.png` });
                listAttachments.push(thumb)

                // Array pour les embeds
                const commandListEmbed = new EmbedBuilder()
                    .setColor(client.color)
                    .setAuthor({ name: 'Liste des capacités apprises par Grodou', iconURL: 'https://cdn.discordapp.com/emojis/897582796434985031.png', url: 'http://discord.eternia.fr' })
                    .setTitle(`${categoName} — ${nbCommand > 1 ? "Liste des " + nbCommand + " commandes" : nbCommand + " seule commande disponible"}`)
                    .setDescription(listCommand[i])
                    .setThumbnail(`attachment://${thumb.name}`)
                commandListEmbeds.push(commandListEmbed)
            }

            const filter = i => i.customId === 'select-menu';

            const collector = interaction.channel.createMessageComponentCollector({ type: "SELECT_MENU", filter, time: 120000 });

            collector.on('collect', async i => {
                if (i.user.id !== interaction.user.id) return i.reply({ content: "Bah non, tu ne peux pas faire ça, t'es pas l'auteur du message !", ephemeral: true })

                if (i.customId === 'select-menu') {

                    if (i.values == 'accueil') {
                        i.update({ embeds: [menuEmbed], files: [] })
                    }
                    else if (i.values == 'close') {
                        return await collector.stop()
                    }
                    else {
                        await i.update({ embeds: [commandListEmbeds[parseInt(i.values)]], files: [listAttachments[parseInt(i.values)]] });
                    };
                }
            });

            collector.on('end', async () => {
                interaction.editReply({ components: [] })
            })
        }
        // Si l'utilisateur a indiqué une commande en argument
        else {

            const cmd = client.commands.get(cmdName)
            if (!cmd) {
                return interaction.reply({ content: "Je suis désolé mon bro mais... Cette commande n'existe pas ! <:grodou5:903378318013894669>", ephemeral: true, fetchReply: true });
            }

            let catLinkMinia = ((cmd.category).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""))
            const thumbnail = new AttachmentBuilder(`./Img/help/g_${catLinkMinia}.png`, { name: `miniature.png` });

            let permissionsList = cmd.permissions.join(', ');
            permissionsList = permissionsList.replace(/CREATE_INSTANT_INVITE|KICK_MEMBERS|BAN_MEMBERS|ADMINISTRATOR|MANAGE_CHANNELS|MANAGE_GUILD|ADD_REACTIONS|VIEW_AUDIT_LOG|PRIORITY_SPEAKER|STREAM|VIEW_CHANNEL|SEND_MESSAGES|SEND_TTS_MESSAGES|MANAGE_MESSAGES|EMBED_LINKS|ATTACH_FILES|READ_MESSAGE_HISTORY|MENTION_EVERYONE|USE_EXTERNAL_EMOJIS|VIEW_GUILD_INSIGHTS|CONNECT|SPEAK|MUTE_MEMBERS|DEAFEN_MEMBERS|MOVE_MEMBERS|USE_VAD|CHANGE_NICKNAME|MANAGE_NICKNAMES|MANAGE_ROLES|MANAGE_WEBHOOKS|MANAGE_EMOJIS_AND_STICKERS|USE_APPLICATION_COMMANDS|REQUEST_TO_SPEAK|MANAGE_EVENTS|MANAGE_THREADS|USE_PRIVATE_THREADS|CREATE_PRIVATE_THREADS|USE_EXTERNAL_STICKERS|SEND_MESSAGES_IN_THREADS|START_EMBEDDED_ACTIVITIES|MODERATE_MEMBER/gi, function (matched) { return dicoPermissions[matched]; });

            let recapExemple = cmd.examples.map(a => `> ${prefix}${a}`).join("\n")

            let Embed = new EmbedBuilder()
                .setColor(client.color)
                .setAuthor({ name: `Liste des capacités apprises par Grodou\n[ Help : Commande ➔ ${cmd.name} ]`, iconURL: 'https://cdn.discordapp.com/emojis/897582796434985031.png', url: 'http://discord.eternia.fr' })
                .setTitle(`Informations sur la commande « \`${prefix}${cmd.name}\` »`)
                .setThumbnail(`attachment://${thumbnail.name}`)
                .setDescription(`${cmd.description ? cmd.description : contextDescription[`${cmd.name}`]}`)
                .addFields([
                    { name: '🔹 **Catégorie**', value: `ㅤ${(cmd.category)}`, inline: false },
                    { name: '🔹 **Utilisation**', value: `ㅤ\`${prefix}${cmd.usage}\``, inline: false },
                    { name: '🔹 **Exemple**', value: `${recapExemple}`, inline: false }
                ])
                .setFooter({ text: `${cmd.ownerOnly ? `⚠️ Commande réservée au développeur de ${client.user.username} !` : `Permissions requises : ${permissionsList}`}` });

            interaction.reply({ embeds: [Embed], files: [thumbnail], fetchReply: true })
        }
    },

    async runAutocomplete(client, interaction) {
        const focusedOption = interaction.options.getFocused(true);
        const choices = client.commands?.map(cmd => cmd.name);
        if (!choices) return;
        const filtered = choices.filter(choice => choice.includes(focusedOption.value.toLowerCase()));
        const filteredLimit = filtered.slice(0, 15);
        await interaction.respond(filteredLimit.map(choice => ({ name: choice, value: choice })));
    }
};

const dicoPermissions = { ADD_REACTIONS: "Ajouter des réactions", ADMINISTRATOR: "Administrateur", ATTACH_FILES: "Joindre des fichiers", BAN_MEMBERS: "Bannir des membres", CHANGE_NICKNAME: "Changer les pseudos", CONNECT: "Se connecter", CREATE_INSTANT_INVITE: "Créer une invitation", CREATE_PRIVATE_THREADS: "Créer des fils privés", CREATE_PUBLIC_THREADS: "Créer des fils publics", DEAFEN_MEMBERS: "Mettre en sourdine des membres", EMBED_LINKS: "Intégrer des liens", KICK_MEMBERS: "Expulser des membres", MANAGE_CHANNELS: "Gérer les salons", MANAGE_EMOJIS_AND_STICKERS: "Gérer les émojis et les autocollants", MANAGE_EVENTS: "Gérer les événements", MANAGE_GUILD: "Gérer le serveur", MANAGE_MESSAGES: "Gérer les messages", MANAGE_NICKNAMES: "Gérer les pseudos", MANAGE_ROLES: "Gérer les rôles", MANAGE_THREADS: "Gérer les fils", MANAGE_WEBHOOKS: "Gérer les webhooks", MENTION_EVERYONE: "Mentionner @everyone, @here et tous les rôles", MODERATE_MEMBERS: "Exclure temporairement des membres", MOVE_MEMBERS: "Déplacer des membres", MUTE_MEMBERS: "Rendre les membres muets", PRIORITY_SPEAKER: "Voix prioritaire", READ_MESSAGE_HISTORY: "Voir les anciens messages", REQUEST_TO_SPEAK: "Demande de prise de parole", SEND_MESSAGES: "Envoyer des messages", SEND_MESSAGES_IN_THREADS: "Envoyer des messages dans les fils", SEND_TTS_MESSAGES: "Envoyer des messages de synthèse vocale", SPEAK: "Parler", STREAM: "Vidéo", USE_APPLICATION_COMMANDS: "Utiliser les commandes de l'application", USE_EMBEDDED_ACTIVITIES: "Utiliser les Activités", USE_EXTERNAL_EMOJIS: "Utiliser des émojis externes", USE_EXTERNAL_STICKERS: "Utiliser des autocollants externes", USE_VAD: "Utiliser la Détection de la voix", VIEW_AUDIT_LOG: "Voir les logs du serveurs", VIEW_CHANNEL: "Voir les salons", VIEW_GUILD_INSIGHTS: "Voir les stats du serveur" }
const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js')

module.exports = {
    name: 'thread',
    category: "Modération",
    permissions: ['MANAGE_THREADS'],
    ownerOnly: false,
    usage: 'thread [create|join|leave|add|remove|archive|unarchive|delete]',
    examples: ['thread join', 'thread leave'],
    description: "Je te montre comment gérer les threads !",
    options: [
        {
            name: 'create',
            description: 'Créer un nouveau fil',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'nom',
                    description: 'Le nom du fil à créer',
                    type: ApplicationCommandOptionType.String,
                    required: true
                },
                {
                    name: 'message',
                    description: 'Le premier message dans le fil',
                    type: ApplicationCommandOptionType.String,
                    required: false
                }
            ]
        },
        {
            name: 'join',
            description: 'Ajouter Grodou au fil',
            type: ApplicationCommandOptionType.Subcommand,
        },
        {
            name: 'leave',
            description: 'Enlever Grodou du fil',
            type: ApplicationCommandOptionType.Subcommand,
        },
        {
            name: 'add',
            description: 'Ajouter un utilisateur au fil',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'utilisateur',
                    description: 'Le membre à ajouter au fil',
                    type: ApplicationCommandOptionType.User,
                    required: true
                }
            ]
        },
        {
            name: 'remove',
            description: 'Retirer un utilisateur du fil',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'utilisateur',
                    description: 'Le membre à retirer du fil',
                    type: ApplicationCommandOptionType.User,
                    required: true
                }
            ]
        },
        {
            name: 'archive',
            description: 'Archiver un fil',
            type: ApplicationCommandOptionType.Subcommand,
        },
        {
            name: 'unarchive',
            description: 'Désarchiver un fil',
            type: ApplicationCommandOptionType.Subcommand,
        },
        {
            name: 'delete',
            description: 'Supprimer un fil',
            type: ApplicationCommandOptionType.Subcommand,
            options: [{
                name: 'raison',
                description: 'La raison de la suppression',
                type: ApplicationCommandOptionType.String,
                required: false
            }]
        },
    ],
    async runInteraction(client, interaction) {
        const db = client.db;
        db.query(`SELECT * FROM config WHERE type = 'logs' AND guildID = ${interaction.guild.id}`, async (err, req) => {

            let thread = interaction.channel;

            if (!thread.isThread()) {
                if (interaction.options.getSubcommand() === 'create') {
                    const threadName = interaction.options.getString('nom');
                    const threadMess = interaction.options.getString('message');
                    if (thread.isTextBased()) {
                        await thread.threads.create({
                            name: threadName,
                            reason: threadMess
                        });
                        const threadAuthor = thread.threads.cache.find(x => x.name === threadName);
                        await threadAuthor.members.add(interaction.user.id);
                        await threadAuthor.send({ content: `Hey ! Voici le premier message que tu as voulu envoyer dans ton thread :\`\`\`${threadMess}\`\`\`` })

                        await interaction.reply({ content: `C'est tout bon ${interaction.user}, le thread \`${threadName}\` a bien été créé !`, ephemeral: true })
                    } else {
                        interaction.reply(`Désolé mon bro, mais cette commande ne peut pas être exécutée ici : il faut qu'on soit dans un salon textuel !`)
                    }
                }
                else return interaction.reply(`Désolé mon bro, mais cette commande ne peut pas être exécutée ici : il faut qu'on soit dans un fil !`);
            }

            if (interaction.options.getSubcommand() === 'join') {
                interaction.reply({ content: `Hello ! Grodou est dans la place ! J'ai rejoint le fil !`, ephemeral: true })
                if (thread.joinable) await thread.join();
            }
            else if (interaction.options.getSubcommand() === 'leave') {
                interaction.reply({ content: `Hasta la vista, baby... J'ai quitté le fil, comme tu me l'as ordonné !`, ephemeral: true })
                await thread.leave();
            }
            else if (interaction.options.getSubcommand() === 'add') {
                const user = interaction.options.getMember('utilisateur');
                interaction.reply({ content: `Let's go, ${user.displayName} a bien été ajouté au fil !`, ephemeral: true })
                await thread.members.add(user.id);
            }
            else if (interaction.options.getSubcommand() === 'remove') {
                const user = interaction.options.getMember('utilisateur');
                interaction.reply({ content: `Bien, bien, c'est noté ! ${user.displayName} a bien été retiré du fil !`, ephemeral: true })
                await thread.members.remove(user.id);
            }
            else if (interaction.options.getSubcommand() === 'archive') {
                await interaction.reply({ content: `C'est tout bon, j'ai bien archivé le fil !`, ephemeral: true })
                await thread.setArchived(true);
            }
            else if (interaction.options.getSubcommand() === 'unarchive') {
                await interaction.reply({ content: `Un coup de soufflette et hop ! Un fil désarchivé, un !`, ephemeral: true })
                await thread.setArchived(false);
            }
            else if (interaction.options.getSubcommand() === 'delete') {
                let reason = interaction.options.getString('raison');
                if (!reason) reason = "Aucune raison donnée";
                const logChannel = client.channels.cache.get(req[0].channelID)
                const embed = new EmbedBuilder()
                    .setColor("#41b8e4")
                    .setAuthor({
                        name: `Suppression d'un fil`,
                        iconURL: "https://cdn.discordapp.com/emojis/1004624701903081493.png",
                    })
                    .setDescription(`◽️ **Nom du fil :** \`\`\`${thread.name}\`\`\`\n◽️ **Motif de la suppression :** \`\`\`${reason}\`\`\``)
                    .setTimestamp()

                await logChannel.send({ embeds: [embed] });
                await thread.delete();

            }
        })
    }
}
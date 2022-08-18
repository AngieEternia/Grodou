const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'clear',
    category: "Modération",
    permissions: ['ManageMessages'],
    defaultMemberPermissions: PermissionFlagsBits.ManageMessages,
    ownerOnly: false,
    usage: 'clear [number] <@user> <#channel>',
    examples: ['clear 50', 'clear 50 @Utilisateur', 'clear 50 #nomDuSalon'],
    description: "J'efface un nombre [X] de messages sur un salon ou un utilisateur !",
    options: [
        {
            name: 'nombre',
            description: 'Le nombre de message à supprimer',
            type: ApplicationCommandOptionType.Number,
            required: true
        },
        {
            name: 'utilisateur',
            description: 'L\'utilisateur pour la suppression de messages',
            type: ApplicationCommandOptionType.User,
            required: false
        },
        {
            name: 'salon',
            description: 'Le salon pour la suppression de messages',
            type: ApplicationCommandOptionType.Channel,
            required: false
        }
    ],
    async runInteraction(client, interaction) {
        const amountToDelete = interaction.options.getNumber('nombre');
        if (amountToDelete > 100 || amountToDelete < 0) return interaction.reply({ content: 'Il faut que tu me donnes un nombre compris entre \`1\` et \`100\` !', ephemeral: true });

        const target = interaction.options.getMember('utilisateur');

        const channelTarget = interaction.options.getChannel('salon');

        const messagesToDelete = await interaction.channel.messages.fetch();

        // On indique un utilisateur
        if (target) {
            let i = 0;
            const filteredTargetMessages = [];
            (await messagesToDelete).filter(msg => {
                if (msg.author.id == target.id && amountToDelete > i) {
                    filteredTargetMessages.push(msg); i++;
                }
            });

            await interaction.channel.bulkDelete(filteredTargetMessages, true).then(messages => {
                if (messages.size < amountToDelete) return interaction.reply(`Houlà, ${interaction.user}, y'a eu comme qui dirait un petit problème ! Certains messages étaient trop vieux, du coup je n'ai pu supprimer que \`${messages.size} message${messages.size > 1 ? "s" : ""}\` de ${target} !`)
                else return interaction.reply(`C'est tout bon ${interaction.user} ! J'ai bien supprimé \`${messages.size} message${messages.size > 1 ? "s" : ""}\` de ${target} !`)
            })
        }

        // On indique un salon
        else if (channelTarget) {
            await channelTarget.bulkDelete(amountToDelete, true).then(messages => {
                if (messages.size < amountToDelete) return interaction.reply(`Houlà, ${interaction.user}, y'a eu comme qui dirait un petit problème ! Certains messages étaient trop vieux, du coup je n'ai pu supprimer que \`${messages.size} message${messages.size > 1 ? "s" : ""}\` dans ${channelTarget} !`)
                else return interaction.reply(`C'est tout bon ${interaction.user} ! J'ai bien supprimé \`${messages.size} message${messages.size > 1 ? "s" : ""}\` dans ${channelTarget} !`)
            })
        } 
        
        // Pas d'options
        else {
            await interaction.channel.bulkDelete(amountToDelete, true).then(messages => {
                if (messages.size < amountToDelete) return interaction.reply(`Houlà, ${interaction.user}, y'a eu comme qui dirait un petit problème ! Certains messages étaient trop vieux, du coup je n'ai pu supprimer que \`${messages.size} message${messages.size > 1 ? "s" : ""}\` sur ce salon !`)
                else return interaction.reply(`C'est tout bon ${interaction.user} ! J'ai bien supprimé \`${messages.size} message${messages.size > 1 ? "s" : ""}\` sur ce salon !`)
            })
        }

    }
}
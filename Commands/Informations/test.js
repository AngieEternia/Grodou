const { ApplicationCommandOptionType, EmbedBuilder } = require("discord.js")
const Canvas = require(`canvas`);
const interactionCreate = require("../../Events/Client/interactionCreate");

module.exports = {
    name: 'test',
    category: "Informations",
    permissions: ['SEND_MESSAGES'],
    ownerOnly: false,
    usage: 'test',
    examples: ['test'],
    description: "Ceci est un test",
    options: [
        {
            name: 'utilisateur',
            description: 'Le salon pour afficher les images d\'arrivée ou de départ',
            type: ApplicationCommandOptionType.User,
            channelTypes: [2],
            required: true
        }
    ],

    async runInteraction(client, interaction) {
        let Target = interaction.options.getMember('utilisateur');
        const member = await interaction.guild.members.fetch(Target)
        let status;
        member.presence ? status = member.presence.status : status = "offline"
        
        let embed = new EmbedBuilder()
        .addFields({
            name: "Informations générales",
            value: `

            **•** \`Nom\`**:** *${Target.user.username}*.
            **•** \`ID\`**:** *${Target.user.id}*.
            **•** \`Tag\`**:** *${Target.user.tag}*.
            **•** \`Discriminateur\`**:** *${Target.user.discriminator}*.
            **•** \`Statut\`**:** *${status}*.
            **•** \`Rôle\`**:** *${Target.roles.size > 0 ? Target.roles.map(role => role.name).join(", ") : "Aucun"}*.
            **•** \`Compte créé le\`**:** *${Target.user.createdAt.toLocaleString()}*.
            **•** \`Dernière connexion\`**:** *${member.user.lastMessage.createdAt.toLocaleString()}*.
            **•** \`Dernier message\`**:** *${member.user.lastMessage.content}*.
            `
          })

          await interaction.reply({ embeds: [embed] });
    }
}
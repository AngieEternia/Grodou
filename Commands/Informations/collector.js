module.exports = {
    name: 'collector',
    category: "Informations",
    permissions: ['SEND_MESSAGES'],
    ownerOnly: false,
    usage: 'collector',
    examples: ['collector'],
    description: "Je te montre les différents types de boutons qui existent sur Discord !",
    async runInteraction(client, interaction) {
        await interaction.reply({ content: "Tapez le message \`discord\` !" });
        const filter = msg => msg.content.includes("discord");
        const collector = interaction.channel.createMessageCollector({ filter, time: 5000 });

        collector.on('end', collected => {
            interaction.followUp(`${collected.size} messages collectés !`)
        })
    }
}
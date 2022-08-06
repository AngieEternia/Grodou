const { ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: 'antiraid',
    category: "Administration",
    permissions: ['ADMINISTRATOR'],
    ownerOnly: false,
    usage: 'antiraid [choix]',
    examples: ['antiraid on', 'antiraid off'],
    description: "J'active ou désactive le mode anti-raid sur le serveur !",
    options: [
        {
            name: 'choix',
            description: `on = activer l'anti-raid | off = désactiver l'anti-raid`,
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [
                {
                    name: 'Activer',
                    value: 'on'
                },
                {
                    name: 'Désactiver',
                    value: 'off'
                },
            ]
        }
    ],
    async runInteraction(client, interaction) {
        const raidChoices = interaction.options.getString('choix');

        const db = client.db;

        db.query(`SELECT * FROM serveur WHERE guildID = ${interaction.guild.id}`, async (err, req) => {

            if (req.length < 1) return interaction.reply({
                content: `Woups ! Sherlock, y'a comme qui dirait un petit problème : le serveur n'est pas enregistré dans ma base de données ! <:grodou6:903378318563352646>`,
                ephemeral: true
            });

            if (req[0].raid === raidChoices) return interaction.reply({
                content: `Bah alors <:grodou5:903378318013894669> ? L'anti-raid est déjà ${raidChoices === "on" ? "activé" : "désactivé"} !`,
                ephemeral: true
            });

            db.query(`UPDATE serveur SET raid = '${raidChoices}' WHERE guildID = ${interaction.guild.id}`);

            if (raidChoices == 'on') {
                await interaction.reply({
                    content: `D'accord ${interaction.user}, c'est bien noté ! L'anti-raid est a été \`activé\` sur **${interaction.guild.name}** : aucune nouvelle personne ne peut-être accueillie sur le serveur !`,
                    ephemeral: true
                });
            }
            else {
                await interaction.reply({
                    content: `D'accord ${interaction.user}, c'est bien noté ! L'anti-raid est a été \`désactivé\` sur **${interaction.guild.name}** : de nouveaux utilisateurs peuvent de nouveau arriver parmi nous !`,
                    ephemeral: true
                });
            }

        })
    }
}
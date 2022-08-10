const { ApplicationCommandOptionType, EmbedBuilder } = require("discord.js")
const Canvas = require(`canvas`);
const interactionCreate = require("../../Events/Client/interactionCreate");

module.exports = {
    name: 'moah',
    category: "Informations",
    permissions: ['SendMessages'],
    ownerOnly: false,
    usage: 'moah',
    examples: ['moah'],
    description: "Ceci est un Moah",

    async runInteraction(client, interaction) {
        const Moah = await interaction.guild.members.fetch('95579051363672064')

        //const thumbnail = new AttachmentBuilder(`./Img/smiles/grodouWut.png`, { name: `miniature.png` });
        const embed = new EmbedBuilder()
            .setAuthor({ name: 'JOYEUX ANNI... VERSAIREEEEEE', iconURL: 'https://images.emojiterra.com/google/android-11/512px/1f389.png' })
            .setColor(client.color)
            .setDescription(`**ATTENTION MESDAMES ET MESSIEURS, MESSAGE DE LA PLUS HAUTE IMPORTANCE.**\n\n**CECI EST UNE ALERTE DE __NIVEAU 3__**.\n\n**BON ANNIVERSAIRE ${Moah} !!!!!**`)
            .setThumbnail(`https://cdn.discordapp.com/emojis/523441414307315723.webp?size=96&quality=lossless`)            
            .setTimestamp()
            .setFooter({
                text: client.embedFooter,
                iconURL: client.embedFootIcon,
            });
        interaction.reply({ content: `${Moah} <:moah:753515585572175952>`, embeds: [embed] })
    }
}
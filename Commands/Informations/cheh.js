const { EmbedBuilder } = require("discord.js")

module.exports = {
    name: 'cheh',
    category: "Informations",
    permissions: ['SEND_MESSAGES'],
    ownerOnly: false,
    usage: 'cheh',
    examples: ['cheh'],
    description: "CHEEEEEEEEEEEEEH",

    async runInteraction(client, interaction) {
        const cheh = [
            'https://c.tenor.com/cdaRSgNRahMAAAAC/cheh.gif',
            'https://c.tenor.com/mLWmvpsv3XEAAAAC/cheh-bienfaits.gif',
            'https://c.tenor.com/Wc65eDfmz6AAAAAC/nelson-monfort-cheh.gif',
            'https://c.tenor.com/6fxDzL4DHAkAAAAC/cheh-wookie-cheh.gif',
            'https://c.tenor.com/9kOjDjkgs2EAAAAM/gang-de-requins-requins.gif',
            'https://c.tenor.com/LLOu6xrs8EEAAAAC/vilebrequin-vilebrequin-cheh.gif',
            'https://c.tenor.com/RmEuwKiRXnMAAAAC/cheh-alexkidd-alexkidd.gif',
            'https://c.tenor.com/669XHN44kFUAAAAC/cheh-bien-fait.gif',
            'https://c.tenor.com/XSbLpMYBTpIAAAAC/kung-fu-panda.gif',
            'https://c.tenor.com/A82dmzXxlCIAAAAd/chech-vague.gif',
            'https://c.tenor.com/wT6fVH__DAwAAAAC/samuse-cheh.gif',
            'https://c.tenor.com/SwsHb8X1CIIAAAAC/chop-cheh.gif'
        ];

        const randomCheh = cheh[Math.floor(Math.random() * cheh.length)];

        const embed = new EmbedBuilder()
            .setAuthor({ name: 'CHEEEEEEEEEEEEEH', iconURL: 'https://cdn.discordapp.com/emojis/903378319171538984.png' })
            .setColor(client.color)
            .setImage(randomCheh)

        await interaction.reply({ embeds: [embed] });
    }
}
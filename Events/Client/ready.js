const Logger = require(`../../Utils/Logger`);
const chalk = require("chalk");
const dayjs = require("dayjs");

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {

        const arrayOfSatus = [
            `(っ◔◡◔)っ 🍎🍎🍎`,
            `${client.guilds.cache.size} serveur${client.guilds.cache.size > 1 ? 's' : ''} !`,
            `Évangie bizarrement...`,
            `${client.users.cache.size} Eternien${client.users.cache.size > 1 ? 's' : ''} !`,
            `le temps qu'il fait !`,
            `/help si besoin est !`,
            `des 🍎 Parfaites *O*`,
            `le silence qui règne ici...`,
            `Mimiqui.. Bah il est où !?`,
            `Évangie qui chante faux`,
        ];
    
        const arrayOfActivity = [
            `PLAYING`,
            `WATCHING`,
            `WATCHING`,
            `WATCHING`,
            `WATCHING`,
            `PLAYING`,
            `WATCHING`,
            `LISTENING`,
            `WATCHING`,
            `LISTENING`,
        ];
    
        let index = 0;
        setInterval(() => {
            if (index === arrayOfSatus.length) index = 0;
            const status = arrayOfSatus[index];
            const activity = arrayOfActivity[index];
            client.user.setPresence({ activities: [{ name: status, type: activity}], status: "offline" })
            index++;
        }, 10000)

        Logger.client(` —  ${client.user.username} est prêt !`);
        console.log(`----------------------------------------------------\n`+
`██████   ██████   ██████  ██████   ██████  ██    ██ \n`+
`██       ██   ██ ██    ██ ██   ██ ██    ██ ██    ██ \n`+
`██   ███ ██████  ██    ██ ██   ██ ██    ██ ██    ██ \n`+
`██    ██ ██   ██ ██    ██ ██   ██ ██    ██ ██    ██ \n`+
`██████   ██   ██  ██████  ██████   ██████   ██████  \n`+
`----------------------------------------------------\n`+
chalk.blue.bold(`■ ID : `) + client.application.id + '\n' +
chalk.blue.bold(`■ Tags : `) + 'Grodou v14#0761\n' +
chalk.blue.bold(`■ Crée le : `) + dayjs(client.application.createdTimestamp).format("le DD/MM/YYYY à HH:mm:ss") + '\n' +
chalk.blue.bold(`■ Librairie : `) + 'discord.js (v13.6.0)\n' +
chalk.blue.bold(`■ Author : `) + 'Angé#0709\n' +
chalk.blue.bold(`■ Langage : `) + 'fr-FR\n' +
chalk.blue.bold(`■ Serveurs : `) + client.guilds.cache.size + '\n'+
chalk.blue.bold(`■ Utilisateurs : `) + client.users.cache.size + '\n'+
`----------------------------------------------------`)

        const devGuild = await client.guilds.cache.get('968232923323064340');
        devGuild.commands.set(client.commands.map((cmd) => cmd));

        //client.application.commands.set(client.commands.map((cmd) => cmd));
        //client.application.commands.set([])
    }
}
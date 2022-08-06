const Logger = require(`../../Utils/Logger`);
const packageJSON = require(`../../package.json`)
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
        
        await client.application.fetch();
        const discordJSVersion = packageJSON.dependencies["discord.js"].replace('^', 'discord.js (v')+')';

        Logger.client(` —  ${client.user.username} est prêt !`);
        console.log(`----------------------------------------------------\n`+
`██████   ██████   ██████  ██████   ██████  ██    ██ \n`+
`██       ██   ██ ██    ██ ██   ██ ██    ██ ██    ██ \n`+
`██   ███ ██████  ██    ██ ██   ██ ██    ██ ██    ██ \n`+
`██    ██ ██   ██ ██    ██ ██   ██ ██    ██ ██    ██ \n`+
`██████   ██   ██  ██████  ██████   ██████   ██████  \n`+
`----------------------------------------------------\n`+
chalk.blue.bold(`■ ID : `) + client.user.id + '\n' +
chalk.blue.bold(`■ Tags : `) + client.user.tag + '\n' +
chalk.blue.bold(`■ Crée le : `) + dayjs(client.application.createdTimestamp).format("le DD/MM/YYYY à HH:mm:ss") + '\n' +
chalk.blue.bold(`■ NodeJS : `) + process.version +' \n' +
chalk.blue.bold(`■ Librairie : `) + discordJSVersion +' \n' +
chalk.blue.bold(`■ Author : `) + client.application.owner.tag + '\n' +
chalk.blue.bold(`■ Langage : `) + packageJSON.language +' \n' +
chalk.blue.bold(`■ Serveurs : `) + client.guilds.cache.size + '\n'+
chalk.blue.bold(`■ Utilisateurs : `) + client.users.cache.size + '\n'+
`----------------------------------------------------`)

        // Slashcommands sur le serv de développement
        //const devGuild = await client.guilds.cache.get('369070939763376138'); // test sur Eternia
        const devGuild = await client.guilds.cache.get('968232923323064340'); // test sur GrodouEmotes1
        devGuild.commands.set(client.commands.map((cmd) => cmd));

        //Pour avoir les commandes globales
        //client.application.commands.set(client.commands.map((cmd) => cmd));
       
        //Pour supprimer les commandes globales
        client.application.commands.set([])
    }
}
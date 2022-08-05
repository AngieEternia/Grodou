const { MessageEmbed } = require('discord.js')
const ms = require(`ms`)

module.exports = {
    name: 'userinfo',
    category: "Utilisateurs",
    permissions: ['SEND_MESSAGES'],
    ownerOnly: false,
    usage: 'Utiliser le menu contextuel de Discord',
    examples: ['Clic-droit sur un utilisateur'],
    type: 'USER',
    async runInteraction(client, interaction) {
        const member = await interaction.guild.members.fetch(interaction.targetId)

        //Dictionnaire pour les badges
        const dicoBadges = {
            DISCORD_PARTNER: "<:discord_partner:977665915208470528>",
            HYPESQUAD_EVENTS: "<:d_hypesquad_event:977665915091038211>",
            HOUSE_BRILLIANCE: "<:d_house_brilliance:977665915296567326>",
            HOUSE_BRAVERY: "<:d_house_bravery:977665915275608124>",
            HOUSE_BALANCE: "<:d_house_balance:977665915372068914>",
            BUGHUNTER_LEVEL_1: "<:d_bughunter_level_1:977665915174920222>",
            BUGHUNTER_LEVEL_2: "<:d_bughunter_level_2:977665915162333274>",
            EARLY_SUPPORTER: "<:d_early_supporter:977665915376250990>",
            VERIFIED_DEVELOPER: "<:d_early_verified_developer:977665915367850137>",
            EARLY_VERIFIED_DEVELOPER: "<:d_early_verified_developer:977665915367850137>",
            STAFF: "<:d_staff:977665915636310066>",
            MODERATOR: "<:d_moderator:977665915405623376>"
        }

        //Dictionnaire pour les statuts 
        const dicoStatus = {
            online: "<:d_online:977565914990010409>",
            dnd: "<:d_dnd:977565915438788648>",
            idle: "<:d_idle:977565915392659487>",
            offline: "<:d_offline:977565915417804822>",
            stream: "<:d_stream:977565915476549632>"
        }

        //Statut de l'utilisateur
        let status;
        member ? (member.presence ? status = member.presence.status : status = "offline") : status = "offline";

        //On crée le nombre de jour depuis que le compte a été créé/le serveur rejoint
        let dayCreated = ms((new Date()).getTime() - (member.user.createdAt).getTime(), { long: true }) // compte créé depuis...
        let mapObj = { second: "seconde", minute: "minute", hour: "heure", day: "jour" } // mini dico pour traduire ms()
        dayCreated = dayCreated.replace(/second|minute|hour|day/gi, function (matched) { return mapObj[matched]; });
        let dayJoined;
        member ? dayJoined = ms((new Date()).getTime() - (member.joinedAt).getTime(), { long: true }) : ""// serveur rejoint depuis...           
        member ? dayJoined = dayJoined.replace(/second|minute|hour|day/gi, function (matched) { return mapObj[matched]; }) : ""

        //On récupère l'activity de l'user et le customStatus
        let activity // pour récupérer le member.presence.activities et vérifier les conditions
        let userActivity // récap de la forme "verbe + activité"
        let customStatus // pour le statut personnalisé
        let mapActivity = { PLAYING: "Joue à", STREAMING: "Streame", LISTENING: "Écoute", WATCHING: "Regarde", COMPETING: "Participe à", CUSTOM: "" } // mini dico pour traduire les activités
        let connexionUser = "" // pour la plateforme de connexion de user
        let dicoPlateforme = { web: "Web", mobile: "Mobile", desktop: "Ordinateur" } // mini dico pour traduire
        if (status !== "offline") { // si le membre est en ligne...
            activity = member.presence.activities[0];
            if (activity === undefined) { // si member.presence.activities[0] renvoie UNDEFINED
                userActivity = "Ne fait rien actuellement";
                customStatus = "Aucun"
            } else {
                if (activity.type === "CUSTOM") { // si activity CUSTOM
                    if (member.presence.activities[1] !== undefined) { // s'il y a une activité en plus du custom
                        userActivity = member.presence.activities[1].type + " " + member.presence.activities[1].name
                    } else userActivity = "Ne fait rien actuellement";
                    customStatus = activity.state
                }
                else {
                    userActivity = activity.type + " " + activity.name;
                    customStatus = "Aucun"
                }
            }
            userActivity = userActivity.replace(/PLAYING|STREAMING|LISTENING|WATCHING|COMPETING/gi, function (matched) { return mapActivity[matched]; }); // on formate...
            // pour la plateforme de connexion
            let typeConnexion = Object.keys(member.presence.clientStatus);
            for (let i = 0; i < (typeConnexion.length); i++) {
                if ((i + 1) == (typeConnexion.length)) connexionUser += typeConnexion[i]
                else connexionUser += typeConnexion[i] + " - "
            }
            connexionUser = connexionUser.replace(/web|mobile|desktop/gi, function (matched) { return dicoPlateforme[matched]; }); // on formate...

        } else {
            userActivity = "Ne fait rien actuellement"
            customStatus = "Aucun";
            connexionUser = "Inconnue";
        }

        const embed = new MessageEmbed()
            .setAuthor({ name: `${member.user.tag} (${member.id})`, iconURL: member.user.bot ? 'https://cdn.discordapp.com/emojis/1002260214642384906.png' : 'https://cdn.discordapp.com/emojis/1002260213434421288.png' })
            .setColor(client.color)
            .setThumbnail(member.user.displayAvatarURL())
            .addFields(
                {
                    name: `<:sep1:975384221138948126>  Informations sur l'utilisateur  <:sep3:975384220849557545>`,
                    value: [
                        `> ◽️ **Pseudo** : \`${member.user.username}\``,
                        `> ◽️ **Tag** : \`${member.user.discriminator}\``,
                        `> ◽️ **Identifiant** : \`${member.user.id}\``,
                        `> ◽️ **Status** : ${dicoStatus[status]}`,
                        `> ◽️ **Plateforme de connexion** : \`${connexionUser}\``,
                        `> ◽️ **Badges** : ${(await member.user.fetchFlags()).toArray().length >= 1 ? dicoBadges[(await member.user.fetchFlags()).toArray().join(" ")] : "\`Aucun badge\`"}`,
                        `> ◽️ **Activité** : \`${userActivity}\``,
                        `> ◽️ **Statut personnalisé** : \`${customStatus}\``,
                        `> ◽️ **Création du compte** : \`il y a ${dayCreated}\` (<t:${Math.floor(member.user.createdAt / 1000)}:D>)\n`,
                    ].join("\n")
                },
                {
                    name: `<:sep1:975384221138948126>  Informations sur le membre  <:sep3:975384220849557545>`,
                    value: [
                        `> ◽️ **Surnom** : \`${member.nickname ? member.nickname : "Aucun surnom"}\``,
                        `> ◽️ **Nombre de rôles** : \`${member.roles.cache.size - 1} rôle${member.roles.cache.size - 1 > 1 ? "s" : ""}\``,
                        `> ◽️ **Rôle le plus haut :** ${member.roles.highest}`,
                        `> ◽️ **Modérateur :** ${member.kickable ? '🔴' : '🟢'}`,
                        `> ◽️ **Arrivée sur ${member.guild.name}** : \`il y a ${dayJoined}\` (<t:${Math.floor(member.joinedAt / 1000)}:D>)`,
                        ``,
                        ``,
                        ``,
                    ].join("\n")
                }
            )

        interaction.reply({ embeds: [embed] })
    }
}
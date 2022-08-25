module.exports = {
    name: 'messageCreate',
    once: false,
    execute(client, message) {
        const db = client.db;

        if (message.author.bot) return; //On ne veut pas que Grodou pète un câble et se réponde à lui-même en boucle...

        db.query(`SELECT * FROM serveur WHERE guildID = ${message.guild.id}`, async (err, reqServ) => {
            
            // Insertion des données dans la table user de la base de données
            db.query(`SELECT * FROM user WHERE userID = ${message.author.id} AND guildID = ${message.guild.id}`, async (err, req) => {

                // S'il n'y a pas de ligne pour l'utilisateur
                if (req.length < 1) {

                    let sql = `INSERT INTO user (guildID, userID, xp, level, messages) VALUES ('${message.guild.id}', '${message.author.id}', 0, 0, 1)`
                    db.query(sql, function (err) {
                        if (err) throw err;
                    })
                    // S'il y a déjà la ligne...
                } else {
                    /****************************************************
                    *********** Gestion du nombre de messages ***********
                    ****************************************************/

                    let numberMessages = req[0].messages
                    db.query(`UPDATE user SET messages = '${numberMessages + 1}' WHERE userID = ${message.author.id} AND guildID = ${message.guild.id}`)

                    /****************************************************
                    ************** Gestion de l'expérience **************
                    ****************************************************/
                    let xp = Math.floor(Math.random() * 20) + 1;
                    let need = (parseInt(req[0].level) + 1) * 1000;

                    db.query(`UPDATE user SET xp = '${parseInt(req[0].xp) + xp}' WHERE userID = ${message.author.id} AND guildID = ${message.guild.id}`)

                    if (parseInt(req[0].xp) >= need) {

                        db.query(`UPDATE user SET level = '${parseInt(req[0].level) + 1}' WHERE userID = ${message.author.id} AND guildID = ${message.guild.id}`)
                        db.query(`UPDATE user SET xp = '${parseInt(req[0].xp) - need}' WHERE userID = ${message.author.id} AND guildID = ${message.guild.id}`)

                        message.channel.send(`Tadadadaaa ! ${message.author}, tu montes au niveau \`${parseInt(req[0].level) + 1}\` !`)
                    }

                    if (parseInt(req[0].xp) < 0) {

                        db.query(`UPDATE user SET level = '${parseInt(req[0].level) - 1}' WHERE userID = ${message.author.id} AND guildID = ${message.guild.id}`)
                        db.query(`UPDATE user SET xp = '${(parseInt(req[0].level) * 1000) + parseInt(req[0].xp)}' WHERE userID = ${message.author.id} AND guildID = ${message.guild.id}`)

                        message.channel.send(`Oh non ! ${message.author}, tu es redescendu au niveau \`${parseInt(req[0].level) - 1}\`...`)
                    }
                }
            });

            /****************************************************
            ******* Interactions de Grodou avec le serveur ******
            ****************************************************/
            db.query(`SELECT GROUP_CONCAT(DISTINCT channelID SEPARATOR "', '") AS channels FROM setup WHERE type = 'troll' AND guildID = ${message.guild.id}`, async (err, result) => {
                if (result.length < 1) return;

                const channelsTroll = "['" + result[0].channels + "']";

                if (channelsTroll.includes(message.channel.id)) {
                    // On appelle le fichier Json où se trouvent toutes les définitions
                    const definitions = require(`../../Json/interactions_grodou.json`);

                    // Quelques fonctions rigolotes pour se simplifier la tâche : détection de mots, message.send random et et mmessage.reply random
                    function detection(motsATrouver, contenu) {
                        return motsATrouver.some(mot => contenu.toLowerCase().includes(mot));
                    }
                    function envoi(possibilites, canal) {
                        canal.send(possibilites[Math.floor(Math.random() * possibilites.length)]);
                    }
                    function reply(possibilites, message) {
                        message.reply(possibilites[Math.floor(Math.random() * possibilites.length)]);
                    }

                    // On passe aux events si /setevent a été mis sur "on" !
                    if (reqServ[0].troll === "on") {
                        // On détecte les mots pas très jolis ici...
                        if (Math.random() >= 0.4) {
                            if (detection(definitions.forbiddenWords, message.content)) {
                                envoi(definitions.repInsultes, message.channel);
                            }
                        }
                        /////////////////////////// POMMES ///////////////////////////
                        // Réactions aux mots autour des pommes
                        if (detection(definitions.text_pommes, message.content)) {
                            envoi(definitions.text_pommes_rep, message.channel);
                        }
                        // S'il y a les deux emojis 🍎 et 🍏
                        if (message.content.includes('🍎') & message.content.includes('🍏')) {
                            await message.channel.send("Dude, écoute moi bien.");
                            await message.channel.send(">>> ◽️ Tu prends la 🍏, l'histoire s'arrête là, tu te réveilles *dans ton lit*, et **tu crois ce que tu veux**.\n◽️ Tu prends la 🍎, tu restes au *Pays des Merveilles* et je te montre jusqu'où mène **Grodouland**.");
                            await message.channel.send({ files: [`./Img/grodou_matrix.jpg`] });
                        }
                        // Pour 🍎
                        if (detection(definitions.emoji_pomme, message.content)) {
                            envoi(definitions.emoji_pomme_rep, message.channel);
                        }
                        // Et pour 🍏
                        if (detection(definitions.emoji_pomme_verte, message.content)) {
                            envoi(definitions.emoji_rep_verte, message.channel);
                        }

                        /////////////////////////// UWU et OWO ///////////////////////////
                        // UwU
                        if (detection(["uwu"], message.content)) {
                            await message.channel.send(`Oh... ${message.author}-sempai...`);
                            await message.channel.send({ files: [`./Img/emotes/groduwu.png`] });
                        }

                        // UwU
                        if (detection(["owo", "ôwô", "owô", "ôwo", "òwó"], message.content)) {
                            await message.channel.send({ files: [`./Img/emotes/owo.png`] });
                        }

                        /////////////////////////// GRODOY ///////////////////////////
                        if (detection(["grodoy", "grodoi"], message.content)) {
                            if (Math.random() >= 0.75) {
                                await message.channel.send(`***Sir Grodoy Duc d'Esternia, pourfendeur du dragonfeu tout shaïné, Suzerain de tous les clodos du __Bar de la Commu__, Régent de la cidrerie, Marquis des pommes rouges, Baron de la drogue, Lanceur de punchlines, Chevalier des frites belges, Grand Prêtre des Nergaprout, Jeune cadre dynamique, Véloce ainsi que mécontent, Troisième du Nom.\n\nPour vous servir.***`);
                                await message.channel.send({ files: [`./Img/grodoy.png`] });
                            }
                        }

                        /////////////////////////// AUTRES TRUCS ///////////////////////////
                        // Star Wars
                        if (detection(definitions.hellothere, message.content)) {
                            envoi([definitions.starwars[0]], message.channel);
                            envoi([definitions.starwars[1]], message.channel);
                        }
                        // JPP
                        if (Math.random() >= 0.5) {
                            if (detection(definitions.jpp, message.content)) {
                                envoi(definitions.jpp_rep, message.channel);
                            }
                        }
                    }
                }
            });
            // Grodou réagit bizarrement quand on le ping !
            if (message.mentions.has(client.user)) {
                var RepMention =
                    [
                        `Oui ? C'est pour quoi ? <:grodou3:715507273623142461>`,
                        `Qui le demande ?`,
                        `Bah, pourquoi tu me ping comme ça, hein ? <:grodou7:715507273954492436>`,
                        `Eh oh ${message.author}, va falloir te calmer, sinon ça va barder <:grotrigger:697176055936712715>`,
                        `MAIS ARRÊTE DE ME PING POUR RIEN !!!`,
                        `Ok. Je quitte Eternia.`,
                        `J'ai pas le temps frangin, je dois buter Évangie... <:groAH2:523441414307315723>`,
                        `${message.author}, je sais que tu m'aimes, mais mon cœur est déjà pris.`,
                        `Tu es triste ? Arrête. <:arrete:898640048348614696>`,
                        `Tu me ping ? Arrête. <:arrete:898640048348614696>`,
                        `<:groAH1:585558960719790206><:groAH2:523441414307315723><:groAH1:585558960719790206>`,
                        `🍎🍎🍎🍎🍎✨`,
                        `Non, je suis le pape et j'attends ma sœur. \n<:grodou3:903378318362017803>`,
                        `J'peux pas, j'ai pas le temps, j'ai rien à faire.`,
                        `Minute papillon, je termine. <:groAH2:523441414307315723>`
                    ];
                message.reply(RepMention[Math.floor(Math.random() * RepMention.length)]);
            }

            /****************************************************
            ********** Fin des interactions de Grodou  **********
            ****************************************************/
        });
    }
}
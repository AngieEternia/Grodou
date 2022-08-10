const { EmbedBuilder, AttachmentBuilder } = require('discord.js')
const { createCanvas, loadImage } = require('canvas')

module.exports = {
    name: 'guildMemberAdd',
    once: false,
    async execute(client, member) {

        const db = client.db;
        const embed = new EmbedBuilder()
            .setAuthor({
                name: `${member.user.tag} (id : ${member.id})`,
                iconURL: member.user.displayAvatarURL(),
            })
            .setColor("#21ff81")
            .setDescription(
                `◽️ **Nom d'utilisateur :** ${member}\n◽️ **Créé le :** <t:${parseInt(member.user.createdTimestamp / 1000)}:f> (<t:${parseInt(member.user.createdTimestamp / 1000)}:R>)\n◽️ **Rejoint le :** <t:${parseInt(member.joinedTimestamp / 1000)}:f> (<t:${parseInt(member.joinedTimestamp / 1000)}:R>)`
            )
            .setTimestamp()
            .setFooter({ text: `👍 L'utilisateur a rejoint ${member.guild.name} !` });

        // Logs d'arrivée
        db.query(`SELECT * FROM logs WHERE type = 'members' AND guildID = ${member.guild.id}`, async (err, req) => {
            if (req.length < 1) return;
            else {
                const logChannel = client.channels.cache.get(req[0].channelID);
                logChannel.send({ embeds: [embed] });
            }
        })

        // On vérifie si l'user a été kick après une troisième avertissement
        db.query(`SELECT * FROM warns WHERE guildID = '${member.guild.id}' AND userID = ${member.id}`, async (err, req) => {
            if (req.length < 1) return;
            else {
                db.query(`SELECT * FROM serveur WHERE guildID = '${member.guild.id}'`, async (err, warnReq) => {
                    if (warnReq.length < 1) return;
                    role = member.guild.roles.cache.find(role => role.name === '⛔ Avertissement');
                    member.roles.add(role.id);
                })
            }
        })

        // Mode anti-raid
        db.query(`SELECT * FROM serveur WHERE guildID = ${member.guild.id}`, async (err, req) => {

            if (req.length < 1) return;

            if (req[0].raid === "on") {

                try {
                    await member.user.send(`Le serveur \`${member.guild.name}\` est en mode anti-raid : **les nouveaux utilisateurs ne peuvent pas le rejoindre pour le moment !**`)
                } catch (err) { }

                await member.kick("Mode anti-raid activé")
            }
        })

        // Message d'accueil
        db.query(`SELECT * FROM setup WHERE type = 'welcome' AND guildID = ${member.guild.id}`, async (err, req) => {

            // S'il y a un salon renseigné pour le message d'arrivée, sinon on stoppe le code
            if (req.length < 1) return;
            let channel = client.channels.cache.get(req[0].channelID);
            if (channel === undefined) return;

            // On définit la façon dont le membre est arrivé sur le serveur
            // let welcomeMsg;
            // if (type === "normal") welcomeMsg = `Wesh ${member.user}, bienvenue ici ! Merci à ${invite.inviter} pour l'invitation !`
            // else if (type === "vanity") welcomeMsg = `Wesh ${member.user}, bienvenue ici ! T'as rejoint le serv grâce à la vanity URL \`https://discord.gg/${member.guild.vanityURLCode}\``
            // else welcomeMsg = `Wesh ${member.user}, bienvenue ici !`

            // Un mini dico aléatoire pour les phrases d'arrivée
            const arrayOfWelcome = [
                `Bienvenue sur ${member.guild.name} ! J’espère que tu t’amuseras bien parmi nous, pour sûr !`,
                `Faites place ! Une nouvelle tête est arrivée dans la Guilde de ${member.guild.name} !`,
                `Ouh ! Planquez vite les Pommes Parfaites ! ${member.user.username} va venir toutes les manger !`,
                `Oh, mais voilà ${member.user.username} sur ${member.guild.name} ! Que la fête commence ! `,
                `Rajoutez une place au mess ! ${member.user.username} vient d'entrer et sa faim se fait sentir !`,
                `Par la barbe d'Alakazam ! ${member.user.username} est enfin là, comme l'annonçait la prophétie !`,
                `Un ! Sans travail pas de médaille !\nDeux ! Les froussards au placard !\nTrois ! Garde le sourire pour réussir !`,
                `Oush oush ! Bling bling et sapes de marques, c'est ${member.user.username} qui débarque !`,
                `Tiens, tiens, regardez qui est là... En voilà une bonne surprise sur ${member.guild.name}...!`,
                `Toi ! Tu tombes bien. Rien à cirer de ce que t'es en train de faire... Ramène ta fraive sur ${member.guild.name}, et qu'ça saute !`,
            ];
            const textWelcome = arrayOfWelcome[Math.floor(Math.random() * arrayOfWelcome.length)];

            /****************************************************
            ********************** Canvas ***********************
            ****************************************************/

            const canvas = createCanvas(800, 350);
            const ctx = canvas.getContext(`2d`);

            function roundRectFill(x, y, w, h, radius) { // Fonction pour arrondir les angles
                var r = x + w;
                var b = y + h;
                ctx.beginPath();
                ctx.moveTo(x + radius, y);
                ctx.lineTo(r - radius, y);
                ctx.quadraticCurveTo(r, y, r, y + radius);
                ctx.lineTo(r, y + h - radius);
                ctx.quadraticCurveTo(r, b, r - radius, b);
                ctx.lineTo(x + radius, b);
                ctx.quadraticCurveTo(x, b, x, b - radius);
                ctx.lineTo(x, y + radius);
                ctx.quadraticCurveTo(x, y, x + radius, y);
                ctx.fill();
                ctx.closePath();
            }
            function wrapText(text, x, y, maxWidth, lineHeight) {
                var words = text.split(' ');
                var line = '';
                for (var n = 0; n < words.length; n++) {
                    var testLine = line + words[n] + ' ';
                    var metrics = ctx.measureText(testLine);
                    var testWidth = metrics.width;
                    if (testWidth > maxWidth && n > 0) {
                        ctx.strokeText(line, x, y);
                        ctx.fillText(line, x, y);
                        line = words[n] + ' ';
                        y += lineHeight;
                    }
                    else {
                        line = testLine;
                    }
                }
                ctx.strokeText(line, x, y);
                ctx.fillText(line, x, y);
            }

            //Avatar de l'user
            ctx.beginPath();
            ctx.save();
            let xAvatar = 607;
            let yAvatar = 33;
            roundRectFill(xAvatar, yAvatar, 160, 160, 30);
            ctx.clip();
            const userAvatar = await loadImage(member.user.displayAvatarURL({ extension: 'png'}));
            ctx.drawImage(userAvatar, xAvatar, yAvatar, 160, 160);
            ctx.restore();
            ctx.closePath();

            // Arrière plan aléatoire
            const minImg = 1;
            const maxImg = 58;
            let randomBckg = Math.floor(Math.random() * (maxImg - minImg)) + minImg;
            const background = await loadImage(`./Img/welcome/${randomBckg}.png`);
            ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

            // // Pseudo de l'user et tag
            let pseudoUser = (member.user.username).toUpperCase();
            let xPseudoUser = 590;
            let yPseudoUser = 100;
            let maxLargPseudoUser = 570;
            ctx.textAlign = 'right';
            ctx.font = `50px Facundo Black`;
            ctx.strokeStyle = `#fff`;
            ctx.lineWidth = 8;
            ctx.strokeText(pseudoUser, xPseudoUser, yPseudoUser, maxLargPseudoUser);
            ctx.fillStyle = `#000`;
            ctx.fillText(pseudoUser, xPseudoUser, yPseudoUser, maxLargPseudoUser);
            let tagUser = "#" + member.user.discriminator;
            ctx.font = `30px Facundo Black`;
            ctx.fillStyle = "#96568e"
            ctx.strokeText(tagUser, xPseudoUser, yPseudoUser + 45);
            ctx.fillText(tagUser, xPseudoUser, yPseudoUser + 45);

            // // Username du bot
            ctx.font = `40px FazetaSans-Bold`;
            ctx.textAlign = 'center';
            ctx.fillStyle = `#fff`;
            let pseudoBot = client.user.username;
            ctx.fillText(pseudoBot, 320, 188);

            // //Texte
            ctx.font = `32px FazetaSans-Bold`;
            ctx.textAlign = 'left';
            ctx.lineWidth = 3;
            ctx.strokeStyle = '#474747'
            ctx.fillStyle = `#fff`;
            wrapText(textWelcome, 210, 250, 580, 32);

            //Avatar de Grodou
            const minDou = 1;
            const maxDou = 9;
            let randomAvatarGrodou = Math.floor(Math.random() * (maxDou - minDou)) + minDou;
            const avatarBot = await loadImage(`./Img/welcome/avatars/${randomAvatarGrodou}.png`)
            ctx.drawImage(avatarBot, 25, 149, 175, 176)

            const attachment = new AttachmentBuilder(canvas.toBuffer(), { name: `welcome.png` });

            /****************************************************
            ****************** Fin de Canvas ********************
            ****************************************************/

            await channel.send({ files: [attachment] });
        })
    }
}
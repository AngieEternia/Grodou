const { ApplicationCommandOptionType, AttachmentBuilder } = require('discord.js');
const Canvas = require(`canvas`)

module.exports = {
    name: 'rank',
    category: "Expérience",
    permissions: ['SEND_MESSAGES'],
    ownerOnly: false,
    usage: 'rank <@member>',
    examples: ['rank', 'rank @utilisateur'],
    description: "Je te dis ton niveau ou celui d'un membre sur le serveur !",
    options: [
        {
            name: 'utilisateur',
            description: 'Le membre dont vous souhaitez voir le rang',
            type: ApplicationCommandOptionType.User,
            required: false
        }
    ],
    async runInteraction(client, interaction) {
        const db = client.db;

        let target = interaction.options.getMember('utilisateur');
        let user;
        if (!target) {target = interaction.user; user = interaction.user} else user = target.user;
        let member = await interaction.guild.members.fetch(target);

        await interaction.reply({ content: `Bouge pas mon Psykokwak, je cherche ça dans mon bazar...`, fetchReply: true });

        db.query(`SELECT * FROM user WHERE userID = ${user.id} AND guildID = ${interaction.guild.id}`, async (err, req) => {

            if (req.length < 1) {
                interaction.editReply({ content: `Wolà ! <:grodouNO:520329945168347157> Cette personne n'est pas enregistrée !`, ephemeral: true });
            }

            const calculXp = async (xp, level) => {

                let xptotal = 0;
                for (let i = 0; i < (level + 1); i++) {
                    xptotal = xptotal + (i * 1000);
                }
                xptotal = xptotal + xp;
                return xptotal;
            }

            db.query(`SELECT * FROM user WHERE guildID = ${interaction.guild.id} ORDER BY level DESC, xp DESC`, async (err, all) => {

                const leaderboard = all.sort((a, b) => calculXp(b.xp, b.level) - calculXp(a.xp, a.level));
                const rank = leaderboard.findIndex(u => u.userID === user.id) + 1;
                let position = rank > 1 ? `${rank}ème` : `\`${rank}er\``;


                const status2color = {
                    online: "#3ba55d",
                    dnd: "#ed4245",
                    idle: "#faa81a",
                    offline: "#747f8d",
                };

                const status = member.presence ? member.presence.status : "offline"; // pour afficher la couleur du statut
                const color = status2color[status]; // same
                const progressionXP = Math.round((req[0].xp / ((parseInt(req[0].level) + 1) * 1000)) * 100);

                /****************************************************
                ********************** Canvas ***********************
                ****************************************************/

                const canvas = Canvas.createCanvas(700, 200);
                const ctx = canvas.getContext(`2d`);
                const background = await Canvas.loadImage(`./Img/rank/background.png`);
                ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

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
                function roundRectStroke(x, y, w, h, radius) { // Fonction pour arrondir les angles
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
                    ctx.stroke();
                    ctx.closePath();
                }

                // contour de la carte
                ctx.lineJoin = 'round';
                ctx.lineWidth = 15;
                ctx.strokeStyle = '#fff';
                ctx.save();
                ctx.globalAlpha = 0.45;
                ctx.strokeRect(0, 0, 700, 200);
                ctx.restore();

                //contour avatar
                ctx.beginPath();
                ctx.arc(100, 100, 78, 0, Math.PI * 2, false);
                ctx.closePath();
                ctx.fillStyle = '#fff';
                ctx.fill();
                ctx.save(); // on save avant le cut de l'avatar

                // avatar
                ctx.beginPath();
                ctx.arc(100, 100, 75, 0, Math.PI * 2, true);
                ctx.closePath();
                ctx.clip();
                const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ extension: 'png'}));
                ctx.drawImage(avatar, 25, 25, 150, 150);
                ctx.restore(); // on restaure la zone de travail avant le cut

                //statut de l'user
                ctx.beginPath();
                ctx.arc(160, 150, 20, 0, Math.PI * 2, false);
                ctx.closePath();
                ctx.fillStyle = '#fff';
                ctx.fill();
                ctx.beginPath();
                ctx.arc(160, 150, 17, 0, Math.PI * 2, false);
                ctx.closePath();
                ctx.fillStyle = color;
                ctx.fill();

                //barre de progression
                //// contour                     
                ctx.beginPath();
                ctx.lineWidth = 4;
                ctx.strokeStyle = '#fff';
                ctx.save();
                ctx.globalAlpha = 0.65;
                roundRectStroke(210, 135, 453, 33, 20);
                ctx.restore();
                //// fond de la barre
                ctx.fillStyle = '#2d2d2d';
                roundRectFill(210, 135, 453, 33, 20);
                ctx.closePath();
                //// barre en couleur                        
                ctx.beginPath();
                ctx.fillStyle = color;
                roundRectFill(213, 138, Math.round(450 * progressionXP / 100), 27, 17);
                ctx.closePath();

                // Pseudo et tag
                ctx.font = `bold 35px Quicksand`;
                ctx.fillStyle = `#fff`;
                let pseudoUser = user.username;
                while (ctx.measureText(pseudoUser).width > 200) {
                    pseudoUser = pseudoUser.substring(0, pseudoUser.length - 1);
                }
                const Tag = user.tag;
                const distanceTag = ctx.measureText(pseudoUser).width + 213
                const numberTag = Tag.slice(Tag.length - 5)
                ctx.fillText(pseudoUser, 208, 115);
                ctx.font = `bold 20px Quicksand`;
                ctx.fillStyle = `#7f7f7f`;
                ctx.fillText(numberTag, distanceTag, 115);

                // Niveau
                ctx.font = `50px Bahnschrift Light`;
                ctx.textAlign = 'right';
                ctx.fillStyle = color;
                const nivUser = req[0].level;
                const distanceLvl = ctx.measureText(nivUser).width + 25;
                ctx.fillText(req[0].level, 675, 60);

                ctx.font = `bold 25px Quicksand`;
                ctx.textAlign = 'right';
                ctx.fillStyle = color;
                ctx.fillText(`NIV `, (700 - distanceLvl), 62);

                // XP, requis et %
                function kFormatter(num) {
                    return Math.abs(num) > 999 ? Math.sign(num) * ((Math.abs(num) / 1000).toFixed(1)) + 'K' : Math.sign(num) * Math.abs(num)
                }
                const apple = await Canvas.loadImage(`./Img/icones/xp.png`)
                ctx.drawImage(apple, 660, 93, 24, 24)
                ctx.font = `bold 20px Quicksand`;
                ctx.textAlign = 'right';
                //const XPrequise = ` / ${kFormatter((parseInt(req[0].level) + 1) * 1000)} EXP`;
                const XPrequise = ` / ${kFormatter((parseInt(req[0].level) + 1) * 1000)}`;
                const XPpossedee = req[0].xp;
                const XPpourcent = `${Math.round((req[0].xp / ((parseInt(req[0].level) + 1) * 1000)) * 100)}%`;
                const distanceXP = ctx.measureText(XPrequise).width + 45;
                ctx.fillStyle = `#7f7f7f`;
                ctx.fillText(XPrequise, 655, 115);
                ctx.fillStyle = `#fff`;
                ctx.fillText(kFormatter(XPpossedee), (700 - distanceXP), 115);

                // Badges de niveaux
                const badge0 = await Canvas.loadImage(`./Img/rank/badge0.png`) // lvl 0
                const badge1 = await Canvas.loadImage(`./Img/rank/badge1.png`) // lvl 1
                const badge2 = await Canvas.loadImage(`./Img/rank/badge2.png`) // lvl 5
                const badge3 = await Canvas.loadImage(`./Img/rank/badge3.png`) // lvl 10
                const badge4 = await Canvas.loadImage(`./Img/rank/badge4.png`) // lvl 15
                const badge5 = await Canvas.loadImage(`./Img/rank/badge5.png`) // lvl 20
                const badge6 = await Canvas.loadImage(`./Img/rank/badge6.png`) // lvl 30
                const badge7 = await Canvas.loadImage(`./Img/rank/badge7.png`) // lvl 40
                const badge8 = await Canvas.loadImage(`./Img/rank/badge8.png`) // lvl 50
                const badge9 = await Canvas.loadImage(`./Img/rank/badge9.png`) // lvl 65
                const badge10 = await Canvas.loadImage(`./Img/rank/badge10.png`) // lvl 80
                const badge11 = await Canvas.loadImage(`./Img/rank/badge11.png`) // lvl 100
                if (nivUser < 1) { ctx.drawImage(badge0, 180, 17, 360, 65) }
                else if (nivUser >= 1 & nivUser < 5) { ctx.drawImage(badge1, 180, 17, 360, 65) }
                else if (nivUser >= 5 & nivUser < 10) { ctx.drawImage(badge2, 180, 17, 360, 65) }
                else if (nivUser >= 10 & nivUser < 15) { ctx.drawImage(badge3, 180, 17, 360, 65) }
                else if (nivUser >= 15 & nivUser < 20) { ctx.drawImage(badge4, 180, 17, 360, 65) }
                else if (nivUser >= 20 & nivUser < 30) { ctx.drawImage(badge5, 180, 17, 360, 65) }
                else if (nivUser >= 30 & nivUser < 40) { ctx.drawImage(badge6, 180, 17, 360, 65) }
                else if (nivUser >= 40 & nivUser < 50) { ctx.drawImage(badge7, 180, 17, 360, 65) }
                else if (nivUser >= 50 & nivUser < 65) { ctx.drawImage(badge8, 180, 17, 360, 65) }
                else if (nivUser >= 65 & nivUser < 80) { ctx.drawImage(badge9, 180, 17, 360, 65) }
                else if (nivUser >= 80 & nivUser < 100) { ctx.drawImage(badge10, 180, 17, 360, 65) }
                else ctx.drawImage(badge11, 180, 17, 360, 65);

                const attachment = new AttachmentBuilder(canvas.toBuffer(), `rang.png`);

                let totalXP = 0;
                for (let i = 0; i < req.length; i++) {
                    for (let a = 0; a < (req[i].level + 1); a++) {
                        totalXP = totalXP + (a * 1000)
                    }
                    totalXP = totalXP + req[i].xp
                }
                totalXP = totalXP

                /****************************************************
                ****************** Fin de Canvas ********************
                ****************************************************/

                interaction.editReply({ content: `Eh voilà la carte que tu m'as demandée ! <:grodou1:903378318387191818>\n**${user.username}** est d'ailleurs **${position}** au classement général avec ses **${totalXP}** <:xp:992723681702858832>!`, files: [attachment] })
            })
        })
    }
}
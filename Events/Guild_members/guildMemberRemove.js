const { EmbedBuilder, AttachmentBuilder } = require('discord.js')
const { createCanvas, loadImage } = require('canvas')

module.exports = {
    name: 'guildMemberRemove',
    once: false,
    async execute(client, member) {
        const db = client.db;

        const fetchKickLog = await member.guild.fetchAuditLogs({
            limit: 1,
            type: 20
        });
        const kickLog = fetchKickLog.entries.first();
        const targetKick = kickLog.target;
        let isMemberKick = false;
        if (targetKick.id === member.id) isMemberKick = true;

        const fetchBanLog = await member.guild.fetchAuditLogs({
            limit: 1,
            type: 22
        });
        const banLog = fetchBanLog.entries.first();
        const targetBan = banLog.target;
        let isMemberBan = false;
        if (targetBan.id === member.id) isMemberBan = true;

        const embed = new EmbedBuilder()
            .setAuthor({
                name: `${member.user.tag} (id : ${member.id})`,
                iconURL: member.user.displayAvatarURL(),
            })
            .setColor("#dc143c")
            .setDescription(
                `◽️ **Nom d'utilisateur :** ${member}\n◽️ **Créé le :** <t:${parseInt(member.user.createdTimestamp / 1000)}:f> (<t:${parseInt(member.user.createdTimestamp / 1000)}:R>)\n◽️ **Rejoint le :** <t:${parseInt(member.joinedTimestamp / 1000)}:f> (<t:${parseInt(member.joinedTimestamp / 1000)}:R>)\n◽️ **Quitté le :** <t:${parseInt(Date.now() / 1000)}:f> (<t:${parseInt(Date.now() / 1000)}:R>)\n`
            )
            .setTimestamp()
            .setFooter({ text: `👋 L'utilisateur a quitté ${member.guild.name}` });

        // Logs de départ
        db.query(`SELECT * FROM logs WHERE type = 'members' AND guildID = ${member.guild.id}`, async (err, req) => {
            if (req.length < 1) return;
            else {
                const logChannel = client.channels.cache.get(req[0].channelID);
                logChannel.send({ embeds: [embed] });
            }
        })

        // Message de départ
        db.query(`SELECT * FROM setup WHERE type = 'welcome' AND guildID = ${member.guild.id}`, async (err, req) => {

            // S'il y a un salon renseigné pour le message d'arrivée, sinon on stoppe le code
            if (req.length < 1) return;
            let channel = client.channels.cache.get(req[0].channelID);
            if (channel === undefined) return;

            // Un mini dico aléatoire pour les phrases d'arrivée
            const arrayOfGoodbye = [
                `${member.user.username} quitte la guilde ! <:grodou7:903378955623616543> Souhaitons-lui bonne chance dans ses prochaines aventures !`,
                `Oh, ${member.user.username} s'en est allé ! La nourriture du mess ne devait pas lui convenir !`,
                `${member.user.username} vient de se faire enlever par un Baudrive sauvage, bon débarras !`,
                `Une fois de plus ${member.user.username} s'envole vers d'autres cieeeuuux !`,
                `Moi j'prends soin d'mon crew, personne touche à mes gars. ${member.user.username} s'en va ? J'en ai rien à carrer ! Le boss de ${member.guild.name}, c’est moi !`,
                `${member.user.username} s’en est reparti vers Oui-Ville. Si vous savez où c’est, ne m'le dites pas.`,
                `Quand ${member.user.username} regarde comme ça on l'voit. S'il regarde comme ça on l'voit plus. On l'voit. On l'voit plus. On l'voit. Ah non... C'est surprenant, hein ?`,
            ];
            const textGoodbye = arrayOfGoodbye[Math.floor(Math.random() * arrayOfGoodbye.length)];

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
            const userAvatar = await loadImage(member.user.displayAvatarURL({ extension: 'png' }));
            ctx.drawImage(userAvatar, xAvatar, yAvatar, 160, 160);
            ctx.restore();
            ctx.closePath();

            // Arrière plan
            const background = await loadImage(`./Img/welcome/58.png`)
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
            wrapText(textGoodbye, 210, 250, 580, 32);

            const attachment = new AttachmentBuilder(canvas.toBuffer(), { name: `byebye.png` });

            /****************************************************
            ****************** Fin de Canvas ********************
            ****************************************************/

            await channel.send({ files: [attachment] });
        })
    }
}
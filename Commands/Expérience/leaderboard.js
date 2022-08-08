const { AttachmentBuilder, EmbedBuilder } = require('discord.js');
const Canvas = require(`canvas`)

module.exports = {
    name: 'leaderboard',
    category: "Expérience",
    permissions: ['SEND_MESSAGES'],
    ownerOnly: false,
    usage: 'leaderboard',
    examples: ['leaderboard'],
    description: "J'indique le top 5 des utilisateurs sur le serveur !",
    async runInteraction(client, interaction) {
        const db = client.db;

        db.query(`SELECT * FROM user WHERE guildID = ${interaction.guild.id} ORDER BY level DESC, xp DESC`, [interaction.guild.id], async (err, req) => {

            let user = interaction.user;

            //le calculXP pour son propre classement
            const calculXp = async (xp, level) => {
                let xptotal = 0;
                for (let i = 0; i < (level + 1); i++) {
                    xptotal = xptotal + (i * 1000)
                }
                xptotal = xptotal + xp
                return xptotal;
            }

            //Le nombre d'enregistrement dans la DB
            let count = 0;
            for (const numberReq of req) {
                if (numberReq.userID?.length) count++;
            }
            const nbEnregistrement = parseInt(count);

            db.query(`SELECT * FROM user WHERE guildID = ${interaction.guild.id} ORDER BY level DESC, xp DESC`, async (err, all) => {
                const leaderboard = all.sort((a, b) => calculXp(b.xp, b.level) - calculXp(a.xp, a.level))
                const rank = leaderboard.findIndex(u => u.userID === user.id) + 1;
                let position = rank > 1 ? `\`${rank}ème\`` : `\`${rank}er\``;

                let top = "";
                const valeurTop = "5";
                let medal = "";

                function kFormatter(num) {
                    return Math.abs(num) > 999 ? Math.sign(num) * ((Math.abs(num) / 1000).toFixed(2)) + 'k' : Math.sign(num) * Math.abs(num)
                }

                let yourPosition = ""

                if (req.length < valeurTop) { // s'il y a moins d'users enregistrés que le top

                    for (let i = 0; i < req.length; i++) {

                        let totalXP = 0;
                        for (let a = 0; a < (req[i].level + 1); a++) {
                            totalXP = totalXP + (a * 1000)
                        }
                        totalXP = totalXP + req[i].xp

                        if (i === 0) { medal = "🥇" } else if (i === 1) { medal = "🥈" } else if (i === 2) { medal = "🥉" } else { medal = ((i + 1) % 2 == 0) ? "🔸" : "🔹" }

                        top += `${medal} ${i + 1} | **Niv. ${req[i].level}** | ${client.users.cache.get(req[i].userID) === undefined ? 'Membre parti' : client.users.cache.get(req[i].userID).tag} (*${kFormatter(totalXP)} <:xp:992723681702858832>*)\n`
                    }

                } else { // sinon...
                    // On affiche le topX
                    for (let i = 0; i < valeurTop; i++) {

                        let totalXP = 0;
                        for (let a = 0; a < (req[i].level + 1); a++) {
                            totalXP = totalXP + (a * 1000)
                        }
                        totalXP = totalXP + req[i].xp

                        if (i === 0) { medal = "🥇" } else if (i === 1) { medal = "🥈" } else if (i === 2) { medal = "🥉" } else { medal = ((i + 1) % 2 == 0) ? "🔸" : "🔹" }

                        top += `${medal} ${i + 1}. **Niv. ${req[i].level}** | ${client.users.cache.get(req[i].userID) === undefined ? 'Membre parti' : client.users.cache.get(req[i].userID).tag} (*${kFormatter(totalXP)} <:xp:992723681702858832>*)\n`
                    }

                    // On affiche la position de l'user par rapport aux autres
                    if (rank === 1) { // S'il est premier
                        for (let k = (rank - 1); k < (rank + 4); k++) {
                            let myPosition = (k === (rank - 1)) ? " (🔔 vous)" : ""
                            yourPosition += `${medal} ${(k + 1)}. **Niv. ${req[(k)].level}** | ${client.users.cache.get(req[k].userID) === undefined ? '*Membre parti*' : client.users.cache.get(req[k].userID).tag}${myPosition}\n`
                        }
                    }
                    else if (rank === 2) { // S'il est deuxième
                        for (let k = (rank - 2); k < (rank + 3); k++) {
                            let myPosition = (k === (rank - 1)) ? " (🔔 vous)" : ""
                            yourPosition += `${medal} ${(k + 1)}. **Niv. ${req[(k)].level}** | ${client.users.cache.get(req[k].userID) === undefined ? '*Membre parti*' : client.users.cache.get(req[k].userID).tag}${myPosition}\n`
                        }
                    }
                    else if (rank === (nbEnregistrement - 1)) { // S'il est dernier
                        for (let k = (rank - 4); k < (rank + 1); k++) {
                            let myPosition = (k === (rank - 1)) ? " (🔔 vous)" : ""
                            yourPosition += `${medal} ${(k + 1)}. **Niv. ${req[(k)].level}** | ${client.users.cache.get(req[k].userID) === undefined ? '*Membre parti*' : client.users.cache.get(req[k].userID).tag}${myPosition}\n`
                        }
                    }
                    else if (rank === nbEnregistrement) { // S'il est dernier
                        for (let k = (rank - 5); k < (rank); k++) {
                            let myPosition = (k === (rank - 1)) ? " (🔔 vous)" : ""
                            yourPosition += `${medal} ${(k + 1)}. **Niv. ${req[(k)].level}** | ${client.users.cache.get(req[k].userID) === undefined ? '*Membre parti*' : client.users.cache.get(req[k].userID).tag}${myPosition}\n`
                        }
                    }
                    else { // Sinon
                        for (let k = (rank - 3); k < (rank + 2); k++) {
                            let myPosition = (k === (rank - 1)) ? " (🔔 vous)" : ""
                            yourPosition += `${medal} ${(k + 1)}. **Niv. ${req[(k)].level}** | ${client.users.cache.get(req[k].userID) === undefined ? '*Membre parti*' : client.users.cache.get(req[k].userID).tag}${myPosition}\n`
                        }
                    }

                }

                //L'embed
                // On crée une constante pour la partie "votre rang" qui s'affiche que dans le cas du req.length >= valeurTop
                const votreRang = (req.length < valeurTop) ? `<:vide:972176077147480086>\nIl n'y a pas assez d'utilisateurs sur ce serveur.` : `<:vide:972176077147480086>\n${yourPosition}`
                // On lance le embed...
                const thumbnail = new AttachmentBuilder(`./Img/smiles/grodouKing.png`, { name: `miniature.png` });
                const setimage = new AttachmentBuilder(`./Img/rank/leaderboard.jpg`, { name: `leaderboard.jpg` });
                const embed = new EmbedBuilder()
                    .setColor(client.color)
                    .setTitle("🏆 Classement général du serveur 🏆")
                    .setThumbnail(`attachment://${thumbnail.name}`)
                    .setDescription(`🔸️ Voici la liste des **${valeurTop} membres** ayant accumulé le plus de points d'expérience <:xp:992723681702858832> sur le serveur.\n🔸️ Vous êtes **${position}** au classement général !\n<:vide:972176077147480086>`)
                    .addFields(
                        {
                            name: `🏅 \`${("Top "+valeurTop+" du serveur").toUpperCase()}\`\n`,
                            value: `<:vide:972176077147480086>\n${top}<:vide:972176077147480086>`
                        },
                        {
                            name: `🔔 \`${("Votre rang").toUpperCase()}\`\n`,
                            value: votreRang
                        }
                    )
                    // .addField('🔔 \`Votre rang\`', votreRang, false)
                    .setImage(`attachment://${setimage.name}`)
                    .setTimestamp()
                    .setFooter({ text: client.embedFooter, iconURL: client.embedFootIcon });

                interaction.reply({ embeds: [embed], files: [thumbnail, setimage] });
            })
        })
    }
}
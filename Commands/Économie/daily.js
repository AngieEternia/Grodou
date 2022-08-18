const { PermissionFlagsBits, AttachmentBuilder, EmbedBuilder } = require('discord.js');
const ms = require('ms');

module.exports = {
    name: 'daily',
    category: "Économie",
    permissions: ['SendMessages'],
    defaultMemberPermissions: PermissionFlagsBits.SendMessages,
    ownerOnly: false,
    usage: 'daily',
    examples: ['daily'],
    description: "Reçois tes Poképièces chaque jour !",
    async runInteraction(client, interaction) {
        const db = client.db;

        db.query(`SELECT * FROM serveur WHERE guildID = ${interaction.guild.id}`, async (err, req) => {
            if (req.length < 1) return;
            const claim = req[0].claim;
            const lastClaim = new Date().getTime();

            db.query(`SELECT * FROM bank WHERE userID = ${interaction.user.id} AND guildID = ${interaction.guild.id}`, async (err, req) => {
                if (req < 1) {
                    let sql = `INSERT INTO bank (guildID, userID, money, bank, dette, daily) VALUES ('${interaction.guild.id}', '${interaction.user.id}', '${claim + 200}', '0', '0', '${lastClaim}')`
                    db.query(sql, async function (err) {
                        if (err) throw err;

                        const thumbnail = new AttachmentBuilder(`./Img/emotes/persian1.png`, { name: `persian.png` });
                        let SuccessEmbed = new EmbedBuilder()
                            .setColor("#40a861")
                            .setAuthor({ name: `${"Bienvenue à la Banque Persian !".toUpperCase()}`, iconURL: "https://cdn.discordapp.com/emojis/996867247245103265.png" })
                            .setThumbnail(`attachment://${thumbnail.name}`)
                            .addFields(
                                {
                                    name: `Bonjour, bonjour ! Bienvenue à la Banque Persian **${interaction.user.username}** !`,
                                    value: `À quoi sert cette banque ? Mais à protéger votre argent <:piece:997504745730211941>, bien sûr !\n\nComme vous ouvrez une épargne pour la première fois, vous touchez un bonus de **200 <:piece:997504745730211941>** en plus des **300 <:piece:997504745730211941> journaliers** !\n\nRevenez demain pour toucher vos prochains intérêts ! *Nyaaaaaa~*`
                                }
                            )

                        await interaction.reply({ embeds: [SuccessEmbed], files: [thumbnail], fetchReply: true });
                    })
                } else {

                    if (req[0].dette === 0) {
                        // Comparons les dates du jour et enregistrée en DB
                        let todayDate = new Date().toLocaleDateString(); // date du jour au format DD/MM/YYYY
                        let registerDate = new Date(parseInt(req[0].daily)).toLocaleDateString() // date enregistrée en base de données au format DD/MM/YYYY

                        // Calcul du temps depuis la dernière exécution de la commande
                        let diffTime = ms((Math.floor(new Date().getTime()) - parseInt(req[0].daily)), { long: true }); // Différence en ms entre le lastClaim et la date actuelle
                        let mapObj = { second: "seconde", minute: "minute", hour: "heure", day: "jour" } // mini dico pour traduire ms()
                        diffTime = diffTime.replace(/second|minute|hour|day/gi, function (matched) { return mapObj[matched]; }) // on traduit...

                        // Conditions...
                        if (todayDate === registerDate) { // On n'a pas chanté de jour
                            // Calcul du temps restant avant le changement de journée
                            let date = new Date(), hDate = date.getHours(), mDate = date.getMinutes(), sDate = date.getSeconds();
                            let timeWait = (24 * 60 * 60) - (hDate * 60 * 60) - (mDate * 60) - sDate;

                            // Mise en forme...
                            let hours = Math.round((timeWait * 1000 / (1000 * 60 * 60)));
                            let minutes = Math.round((timeWait * 1000 / (1000 * 60) % 60));
                            let seconds = Math.round(timeWait * 1000 / 1000 % 60);

                            // Et l'embed !
                            const thumbnail = new AttachmentBuilder(`./Img/emotes/persian2.png`, { name: `persian.png` });
                            let WarningEmbed = new EmbedBuilder()
                                .setColor("#ff0000")
                                .setAuthor({ name: `${"Erreur à la Banque Persian !".toUpperCase()}`, iconURL: "https://cdn.discordapp.com/emojis/979484974443028480.png" })
                                .setThumbnail(`attachment://${thumbnail.name}`)
                                .addFields(
                                    {
                                        name: `Hey ${interaction.user.username}, vous avez déjà perçu vos intérêts du jour ! <:piece:997504745730211941>\n\nVous les avez touchés pour la dernière fois il y a \`${diffTime}\`.\n\nVous devez encore attendre au minimum :`,
                                        value: `\`\`\`js\n${hours} heure${hours > 1 ? "s" : ""} ${minutes} minute${minutes > 1 ? "s" : ""} ${seconds} seconde${seconds > 1 ? "s" : ""}\`\`\``
                                    }
                                )

                            await interaction.reply({ embeds: [WarningEmbed], files: [thumbnail], fetchReply: true });

                        } else { // Le jour a changé !
                            // On met a jour la DB
                            db.query(`UPDATE bank SET money = '${parseInt(req[0].money) + claim}', daily = '${lastClaim}'  WHERE userID = ${interaction.user.id} AND guildID = ${interaction.guild.id}`)

                            // L'embed !
                            const thumbnail = new AttachmentBuilder(`./Img/emotes/persian0.png`, { name: `persian.png` });
                            let SuccessEmbed = new EmbedBuilder()
                                .setColor("#40a861")
                                .setAuthor({ name: `${"Bienvenue à la Banque Persian !".toUpperCase()}`, iconURL: "https://cdn.discordapp.com/emojis/996867247245103265.png" })
                                .setThumbnail(`attachment://${thumbnail.name}`)
                                .addFields(
                                    {
                                        name: `Bonjour, bonjour ! Bienvenue à la Banque Persian **${interaction.user.username}**!`,
                                        value: `Tenez, voici vos intérêts du jour : **${claim} <:piece:997504745730211941>** !\n\nVous possédez actuellement **${parseInt(req[0].money) + claim} <:piece:997504745730211941>** sur votre compte.\n\nRevenez demain pour toucher vos prochains intérêts ! *Nyaaaaaa~*`
                                    }
                                )

                            await interaction.reply({ embeds: [SuccessEmbed], files: [thumbnail], fetchReply: true });
                        }

                    } else {

                        const thumbnail = new AttachmentBuilder(`./Img/emotes/persian2.png`, { name: `persian.png` });
                        let WarningEmbed = new EmbedBuilder()
                            .setColor("#ff0000")
                            .setAuthor({ name: `${"Erreur à la Banque Persian !".toUpperCase()}`, iconURL: "https://cdn.discordapp.com/emojis/998498370282848287.png" })
                            .setThumbnail(`attachment://${thumbnail.name}`)
                            .addFields(
                                {
                                    name: `Hey **${interaction.user.username}**, on a un petit problème !`,
                                    value: `Je viens de voir dans mes registres que tu as une dette de **${(req[0].dette).toLocaleString('fr-FR')} <:piece:997504745730211941>**...\nTu ne peux pas percevoir d'intérêt tant qu'elle n'est pas épongée !`
                                }
                            )

                        interaction.reply({ embeds: [WarningEmbed], files: [thumbnail], fetchReply: true });
                    }

                }
            })
        });
    }
}
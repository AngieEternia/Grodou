module.exports = {
    name: 'voiceStateUpdate',
    once: false,
    async execute(client, oldState, newState) {
        const db = client.db;

        let oldChannel = oldState.channel;
        let newChannel = newState.channel;
        let user = newState.guild.members.cache.get(newState.id).user || oldState.guild.members.cache.get(oldState.id).user;

        db.query(`SELECT * FROM setup WHERE type = 'voice' AND guildID = ${newState.guild.id}`, async (err, req) => {
            //db.query(`SELECT * FROM setup WHERE type = 'voiceCat' AND guildID = ${newState.guild.id}`, async (err, req2) => {
            if (req.length < 1) return;
            else {
                for (let i = 0; i < req.length; i++) {
                    let channel = req[i].channelID;
                    let parent = req[i].parentID;

                    if (newChannel?.id === channel) {
                        let channel = await newChannel.guild.channels.create({ name: `Vocal de ${user.username}`, type: 2 });
                        await channel.setParent(newChannel.parentId);
                        newState.guild.members.cache.get(newState.id).voice.setChannel(channel);
                    }
                    if (oldChannel?.parentId === parent && oldChannel?.id !== channel) {
                        if (oldChannel.members.size <= 0) await oldChannel.delete();
                    }
                }
            }
        })
    }
}
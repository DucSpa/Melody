const { isVoiceChannelEmpty } = require("distube");

module.exports = (client) => {
    client.on("voiceStateUpdate", (oldState, newState) => {
        if (!oldState?.channel) return;

        const voice = client.distube.voices.get(oldState.channel.id);
        if (voice && isVoiceChannelEmpty(oldState.channel)) {
            voice.leave();
            const queue = client.distube.getQueue(oldState.guild.id);

            if (queue && queue.textChannel) {
                console.log(`Attempting to send idle message to textChannel: ${queue.textChannel.name}`);
                queue.textChannel.send("I have left the voice channel because I was idle for too long! :wave:");
            } else {
                console.warn("No suitable text channel found to send the idle message.");
            }
        }
    });
};
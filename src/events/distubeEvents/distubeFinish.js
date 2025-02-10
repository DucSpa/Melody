// src/events/distubeEvents/distubeFinish.js
const shared = require('./shared');

module.exports = (distube) => {
    distube.on('finish', (queue) => {
        const leaveTimeout = setTimeout(() => {
            const voiceChannel = queue.voiceChannel;

            if (voiceChannel) {
                distube.voices.leave(voiceChannel);

                if (queue.textChannel) {
                    console.log(`Attempting to send idle message to textChannel: ${queue.textChannel.name}`);
                    console.log(`System Channel: ${voiceChannel.guild.systemChannel ? voiceChannel.guild.systemChannel.name : 'None'}`);
                    queue.textChannel.send("I have left the voice channel because I was idle for too long! :wave:");
                } else {
                    console.warn("No suitable text channel found to send the idle message.");
                }
            }
        }, 600); // leave after 1 minute
    });
};
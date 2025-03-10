const { EmbedBuilder } = require("discord.js");

// Map to store idle timers per guild
const idleTimers = new Map();

module.exports = (distube) => {
    // Prevent duplicate listener registration
    if (distube._idleHandlersRegistered) return;
    distube._idleHandlersRegistered = true;

    distube.on("finish", (queue) => {
        const voiceChannel = queue.voiceChannel;
        if (!voiceChannel) return;
        const guildId = voiceChannel.guild.id;

        const timer = setTimeout(() => {
            // Make sure voiceChannel is still valid
            if (voiceChannel) {
                distube.voices.leave(voiceChannel);
                if (queue.textChannel) {
                    console.log(`Attempting to send idle message to textChannel: ${queue.textChannel.name}`);
                    console.log(`System Channel: ${voiceChannel.guild.systemChannel}`);
                    queue.textChannel.send({
                        embeds: [
                            new EmbedBuilder()
                                .setDescription(`Saliendo del canal de voz por inactividad! :wave:`)
                                .setColor("#fdc2a2"),
                        ],
                    });
                } else {
                    console.warn("No suitable text channel found to send the idle message.");
                }
            }
            idleTimers.delete(guildId);
        }, 60000); // leave after 1 minute

        idleTimers.set(guildId, timer);
    });

    // Clear the idle timer if a new song starts before the timer expires
    distube.on("playSong", (queue) => {
        const voiceChannel = queue.voiceChannel;
        if (!voiceChannel) return;
        const guildId = voiceChannel.guild.id;
        if (idleTimers.has(guildId)) {
            clearTimeout(idleTimers.get(guildId));
            idleTimers.delete(guildId);
            console.log("Idle timer cleared on new song.");
        }
    });
};
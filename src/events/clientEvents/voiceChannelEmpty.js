const { EmbedBuilder } = require("discord.js");

module.exports = (client) => {
    client.distube.on("voiceStateUpdate", async (oldState, newState) => {
        const queue = client.distube.getQueue(oldState.guild.id);
        if (!queue || !queue.voiceChannel) return;

        const voiceChannel = queue.voiceChannel;

        // Check if the bot is alone in the voice channel
        if (voiceChannel.members.size === 1 && voiceChannel.members.has(client.user.id)) {
            try {
                await queue.stop();
                console.log(`Left empty voice channel: ${voiceChannel.name}`);

                if (queue.textChannel) {
                    await queue.textChannel.send({
                        embeds: [
                            new EmbedBuilder()
                                .setDescription(`Saliendo del canal de voz ya que está vacio :wave:`)
                                .setColor("#fdc2a2"),
                        ]
                    });
                }
            } catch (err) {
                console.error("Error leaving voice channel:", err);
            }
        }
    });
};
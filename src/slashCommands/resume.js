const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("resume")
        .setDescription("Tell the bot to resume the current song!"),
    async execute(interaction) {
        const { member, client } = interaction;
        const voiceChannel = member.voice.channel;
        const botVoiceChannel = interaction.guild.members.me.voice.channel;
        let queue = interaction.client.distube.getQueue(interaction.guildId);

        if (!voiceChannel) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(`:x: **Debes de estar en un canal de voz para usar este comando!**`)
                        .setColor("#fdc2a2"),
                ],
                ephemeral: true,
            });
            return;
        }

        if (botVoiceChannel && voiceChannel.id !== botVoiceChannel.id) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(`:x: **Debes de estar en el mismo canal de voz que el bot para usar este comando!**`)
                        .setColor("#fdc2a2"),
                ],
                ephemeral: true,
            });
            return;
        }

        if (!queue || queue.songs.length === 0) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(`:x: **No hay canciones en la lista de reproduccion!**`)
                        .setColor("#fdc2a2"),
                ],
                ephemeral: true,
            });
            return;
        }

        if (queue.playing) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(`:x: **Esta cancion ya se esta reproduciendo!**`)
                        .setColor("#fdc2a2"),
                ],
                ephemeral: true,
            });
            return;
        }

        await client.distube.resume(voiceChannel);
        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`<:play:1307741628554809364> Reanudando la cancion: ${`**[${queue.songs[0].name}](${queue.songs[0].url})**`}`)
                    .setColor("#fdc2a2"),
            ]
        });
    }
};
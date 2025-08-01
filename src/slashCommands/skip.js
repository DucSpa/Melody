const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("skip")
        .setDescription("Tell the bot to skip the current song!"),
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

        try{
            await client.distube.skip(voiceChannel)
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(`<:skip:1349032919368204391> Saltando la cancion: ${`**[${queue.songs[0].name}](${queue.songs[0].url})**`}`)
                        .setColor("#fdc2a2"),
                ]
            }
            );
        } catch(error){
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(`:x: **No hay mas canciones en la lista de reproduccion!**`)
                        .setColor("#fdc2a2"),
                ],
                ephemeral: true,
            }
            );
        }
    }
};
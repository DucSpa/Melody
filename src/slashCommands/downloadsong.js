const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const ytdl = require("@distube/ytdl-core");
const { getInfo } = require("@distube/ytdl-core");
const ffmpeg = require("fluent-ffmpeg");
const ffmpegInstaller = require("@ffmpeg-installer/ffmpeg");
ffmpeg.setFfmpegPath(ffmpegInstaller.path);

module.exports = {
    data: new SlashCommandBuilder()
        .setName("download")
        .setDescription("Provides a link to download the song you want!")
        .setIntegrationTypes(0, 1)
        .setContexts(0, 1, 2)
        .addStringOption(option =>
            option
                .setName("link")
                .setDescription("Write the URL of the song to download!")
                .setRequired(true)
        ),

    async execute(interaction) {
        const songLink = interaction.options.getString("link");

        // Validate input
        if (!songLink) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(":x: Please provide a valid song link.")
                        .setColor("#fda2a2"),
                ],
                ephemeral: true,
            });
        }

        if (!ytdl.validateURL(songLink)) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(":x: Please provide a valid YouTube link.")
                        .setColor("#fda2a2"),
                ],
                ephemeral: true,
            });
        }

        try {
            await interaction.deferReply();

            // Fetch video info and source stream
            const songInfo = await getInfo(songLink);
            const sourceStream = ytdl.downloadFromInfo(songInfo, {
                filter: "videoandaudio",
                quality: "lowestvideo",
            });

            // Transcode to MP3 via FFmpeg
            const mp3Stream = ffmpeg(sourceStream)
                .format("mp3")
                .audioBitrate(192)
                .on("error", err => {console.error("FFmpeg error:", err);})
                .pipe();

            // Collect MP3 data
            const chunks = [];
            for await (const chunk of mp3Stream) {
                chunks.push(chunk);
            }
            const mp3Buffer = Buffer.concat(chunks);

            // Prepare embed
            const songTitle = songInfo.videoDetails.title;
            const songUrl = songInfo.videoDetails.video_url;
            const songThumbnail = songInfo.videoDetails.thumbnails[0].url;
            
            // Send the MP3 file
            await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(`**:inbox_tray:[${songTitle}](${songUrl})** has been downloaded!`)
                        .setThumbnail(songThumbnail)
                        .setColor("#fdc2a2"),
                ],
                files: [
                    {
                        attachment: mp3Buffer,
                        name: `${songTitle}.mp3`,
                    },
                ],
            });

        } catch (error) {
            console.error(error);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ embeds: [
                    new EmbedBuilder()
                        .setDescription(`:x: There was an error trying to download the song.`)
                        .setColor("#fda2a2"),
                ]});
            } else {
                await interaction.reply({ embeds: [
                    new EmbedBuilder()
                        .setDescription(`:x: There was an error trying to download the song.`)
                        .setColor("#fda2a2"),
                ]});
            }
        }
    },
};

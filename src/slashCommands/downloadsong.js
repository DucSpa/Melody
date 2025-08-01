const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const ytdl = require("@distube/ytdl-core");
const {getInfo} = require("@distube/ytdl-core");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("download")
        .setDescription("Provides a link to download the song you want!")
        .setIntegrationTypes(0, 1)
        .setContexts(0, 1, 2)
        .addStringOption((option) =>
            option
                .setName("link")
                .setDescription("Write the URL or name of the song to download! :3")
                .setRequired(true),
        ),
    async execute(interaction) {
        const songLink = interaction.options.getString("link");

        if (!songLink) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription("Please provide a valid song link or name.")
                        .setColor("#b2a89e"),
                ],
                ephemeral: true,
            });
        }

        if(!ytdl.validateID(songLink)) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription("Please provide a valid YouTube link.")
                        .setColor("#b2a89e"),
                ],
                ephemeral: true,
            });
        }

        const songInfo = await getInfo(songLink);
        const song= ytdl.downloadFromInfo(songInfo, { filter: "audioonly", quality: "highestaudio", language: "en" });
        const songTitle = songInfo.videoDetails.title;
        const songUrl = songInfo.videoDetails.video_url;
        const songThumbnail = songInfo.videoDetails.thumbnails[0].url;
        const user = interaction.user;
        const userImage = user.displayAvatarURL();

        try {
            await interaction.deferReply() // Defer reply to handle potential long response times
            const chunks = [];
            for await (const chunk of song) {
                chunks.push(chunk);
            }
            const fileBuffer = Buffer.concat(chunks);
            await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(`**[${songTitle}](${songUrl})** \n has been downloaded!`)
                        .setThumbnail(songThumbnail)
                        .setFooter({ text: `Requested by ${user.username}`, iconURL: userImage })
                        .setColor("#b2a89e"),
                ],
                files: [{
                    attachment: fileBuffer,
                    name: `${songTitle}.mp3`
                }]
            });
        } catch (error) {
            console.error(error);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp("There was an error trying to download the song.");
            } else {
                await interaction.reply("There was an error trying to download the song.");
            }
        }
    },
};
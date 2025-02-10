const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("play")
		.setDescription("Joins your voice channel and plays a song :3!")
		.setIntegrationTypes(0)
		.setContexts(0)
		.addStringOption((option) =>
			option
				.setName("song")
				.setDescription("Write the URL or name of the song to play! :3")
				.setRequired(true),
		),
	async execute(interaction) {
		const song = interaction.options.getString("song");
		const { member, client } = interaction;
		const voiceChannel = member.voice.channel;
		const options = interaction.options._hoistedOptions;
		const user = (options.find((e) => e.name === "user") && options.find((e) => e.name === "user").member.user) || interaction.user;
		const userImage = user.displayAvatarURL();

		if (!voiceChannel) {
			await interaction.reply({
				embeds: [
					new EmbedBuilder()
						.setDescription(`:x: **Debes de estar en un canal de voz para usar este comando!**`)
						.setColor("#fdc2a2"),
				],
			});
			return;
		}

		try {
			await interaction.deferReply(); // Defer reply to handle potential long response times
			
			// Include textChannel in the options
			await client.distube.play(voiceChannel, song, {
				textChannel: interaction.channel,
				member: member,
			});
			
			const queue = client.distube.getQueue(voiceChannel).songs;
			let lastQueueSong = queue.length - 1;

			await interaction.editReply({
				embeds: [
					new EmbedBuilder()
						.setDescription(`**[${queue[lastQueueSong].name}](${queue[lastQueueSong].url})** \n añadido a la lista de reproduccion!`)
						.setThumbnail(queue[lastQueueSong].thumbnail)
						.addFields({
							name: `:musical_note: Reproduciendo: ${queue[0].name} :musical_note:`,
							value: `${queue[0].likes} :thumbsup:`,
						})
						.setFooter({ text: `Duracion: ${queue[0].formattedDuration}`, iconURL: userImage })
						.setTimestamp()
						.setColor("#b2a89e"),
				],
			});
		} catch (error) {
			console.error(error);
			if (interaction.replied || interaction.deferred) {
				await interaction.followUp("There was an error trying to play the song.");
			} else {
				await interaction.reply("There was an error trying to play the song.");
			}
		}
	},
};

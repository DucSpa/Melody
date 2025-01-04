const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("ping")
		.setDescription("Replies with Pong!"),
	async execute(interaction) {
		await interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setDescription(`:white_check_mark: **Pong! :3**`)
					.setColor("#fdc2a2"),
			],
		});
	},
};

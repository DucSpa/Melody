const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("volume")
        .setDescription("Set the bot volume to your liking!")
        .addIntegerOption((option) =>
            option
                .setName("volume")
                .setDescription("lmao lmao lmao")
                .setRequired(true)
        ),
    async execute(interaction) {
        const { member, client } = interaction;
        const voiceChannel = member.voice.channel;
        let volumeValue = interaction.options.getString("volume")

        if(voiceChannel){
            await client.distube.setVolume(voiceChannel, volumeValue)
            await interaction.reply({embeds:[
                        new EmbedBuilder()
                            .setDescription(`**:speaker: Volumen actual ${volumeValue}**`)
                            .setColor("#fdc2a2"),
                    ]
                }
            );
        }
    }
};
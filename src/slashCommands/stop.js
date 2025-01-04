const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("stop")
        .setDescription("Tell the bot to stop the current song!"),
    async execute(interaction) {
        const { member, client } = interaction;
        const voiceChannel = member.voice.channel;
        let queue = interaction.client.distube.getQueue(interaction.guildId).songs

        if(voiceChannel){
            await client.distube.pause(voiceChannel)
            await interaction.reply({embeds:[
                        new EmbedBuilder()
                            .setDescription(`<:pause:1307738355211042926> Pausando la cancion ${`**[${queue[0].name}](${queue[0].url})**`}`)
                            .setColor("#fdc2a2"),
                    ]
                }
            );
        }
    }
};
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("resume")
        .setDescription("Tell the bot to resume the current song!"),
    async execute(interaction) {
        const { member, client } = interaction;
        const voiceChannel = member.voice.channel;
        let queue = interaction.client.distube.getQueue(interaction.guildId).songs

        if(voiceChannel){
            await client.distube.resume(voiceChannel)
            await interaction.reply({embeds:[
                        new EmbedBuilder()
                            .setDescription(`<:play:1307741628554809364> Reanudando la cancion ${`**[${queue[0].name}](${queue[0].url})**`}`)
                            .setColor("#fdc2a2"),
                    ]
                }
            );
        }
    }
};
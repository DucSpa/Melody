const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("nightcore")
        .setDescription("Add nightcore to the current song!"),
    async execute(interaction) {
        const { member } = interaction;
        const voiceChannel = member.voice.channel;
        let queue = interaction.client.distube.getQueue(interaction.guildId);

        if(voiceChannel){
            await queue.filters.add(['nightcore'])
            await interaction.reply({embeds:[
                        new EmbedBuilder()
                            .setDescription(`nightcore`)
                            .setColor("#fdc2a2")
                            .setImage('https://c.tenor.com/es-dWz_Xy8AAAAAd/tenor.gif')
                    ]
                }
            );
        }
    }
};
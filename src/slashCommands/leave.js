const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("leave")
        .setDescription("Tell the bot to leave the voice channel!")
        .setIntegrationTypes(0, 1)
        .setContexts(0, 1, 2),
    async execute(interaction) {
    const { member, client } = interaction;
    const voiceChannel = member.voice.channel;

    if(voiceChannel){
        await client.distube.voices.leave(voiceChannel)
        await interaction.reply({embeds:[
                        new EmbedBuilder()
                            .setDescription(`Saliendo del canal de voz! :wave:`)
                            .setColor("#fdc2a2"),
                    ]
                }
            );
        }
    }
};

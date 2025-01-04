const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("button") // Define the command name as "button"
        .setDescription("Get a button!"), // Provide a short description of the command
    async execute(interaction) {
        // Create a button component with a custom ID and label
        const confirm = new ButtonBuilder()
            .setCustomId('confirm') // Unique identifier for the button
            .setLabel('Click the button!') // Text displayed on the button
            .setStyle(ButtonStyle.Success); // Set the button style to "Success" (green)

        // Create an action row to hold the button
        const row = new ActionRowBuilder()
            .addComponents(confirm); // Add the button to the row

        // Send an initial response to the user with an embed and the button
        const response = await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`> **Button! :D**`) // Embed message content
                    .setColor("#fdc2a2"), // Set the embed color
            ],
            components: [row], // Attach the action row with the button
            fetchReply: true // Ensure the message object is returned for further manipulation
        });

        let counter = 0; // Initialize a counter to track button clicks

        // Create a message component collector to listen for button interactions
        const collector = response.createMessageComponentCollector({
            filter: i => i.user.id === interaction.user.id, // Only process interactions from the user who initiated the command
        });

        // Event handler for when the button is clicked
        collector.on('collect', async (btnInteraction) => {
            if (btnInteraction.customId === 'confirm') { // Check if the clicked button matches the custom ID
                counter++; // Increment the counter

                // Update the message with the new counter value
                await btnInteraction.update({
                    embeds: [
                        new EmbedBuilder()
                            .setDescription(`> ** ${counter} clicks! **`) // Update the embed description with the counter
                            .setColor("#fdc2a2"), // Retain the same embed color
                    ],
                    components: [row], // Retain the same action row with the button
                });
            }
        });
    },
};

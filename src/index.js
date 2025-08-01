const { Client, Collection, Events, GatewayIntentBits } = require("discord.js");
const fs = require("node:fs");
const path = require("node:path");
const { token } = require("./config.json");
const { DisTube } = require("distube");
const { YouTubePlugin } = require("@distube/youtube");

// Create a new client instance
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds, //Needed to get events from the commands
		GatewayIntentBits.GuildVoiceStates, //Needed to join voice channels
	],
});

client.distube = new DisTube(client, {
	plugins: [new YouTubePlugin()],
});

// Create a new collection to store the commands
client.commands = new Collection();

// Path to the commands
const commandsPath = path.join(__dirname, "slashCommands");

// Read the contents of the path and filter them
const commandFiles = fs
	.readdirSync(commandsPath)
	.filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);

	if ("data" in command && "execute" in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

// Receives an event from a slash command
client.on(Events.InteractionCreate, async (interaction) => {
	// Returns if the is not chat input(a message)
	if (!interaction.isChatInputCommand()) return;

	// Get the command from the interaction
	const command = interaction.client.commands.get(interaction.commandName);

	// Shows a message returns if the command does not exists
	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	// Tries to execute the command
	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({
				content: "There was an error while executing this command!",
				ephemeral: true,
			});
		} else {
			await interaction.reply({
				content: "There was an error while executing this command!",
				ephemeral: true,
			});
		}
	}
});

let leaveTimeout = null;

client.distube.on('finish', queue => {
	// Set timeout to leave after 1 minute (60000 milliseconds)
	leaveTimeout = setTimeout(() => {
		const voiceChannel = queue.voiceChannel;
		if (voiceChannel) {
			client.distube.voices.leave(voiceChannel);
			queue.textChannel.send("I have left the voice channel because I was idle for too long! :wave:");
		}
	}, 600);
});

client.distube.on('playSong', (queue, song) => {
	// Clear the leave timeout if a new song starts playing
	if (leaveTimeout) {
		clearTimeout(leaveTimeout);
		leaveTimeout = null;
	}
});

// Log in to Discord with the token
client.login(token);

// When the client is logged in it will log the following message
client.once(Events.ClientReady, (readyClient) => {
	console.log(`✅ Logged in as ${readyClient.user.tag} :D!`);
});


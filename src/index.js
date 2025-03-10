const { Client, Collection, Events, GatewayIntentBits } = require("discord.js");
const fs = require("node:fs");
const path = require("node:path");
const { token } = require("./config.json");
const { DisTube } = require("distube");
const { YouTubePlugin } = require("@distube/youtube");

// Create a new client instance
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds, // Needed to get events from the commands
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildVoiceStates, // Needed to join voice channels
	],
});

// Initialize DisTube
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

// Load DisTube event handlers
const distubeEventsPath = path.join(__dirname, "events", "distubeEvents");
const distubeEventFiles = fs
	.readdirSync(distubeEventsPath)
	.filter((file) => file.endsWith(".js"));

for (const file of distubeEventFiles) {
	const filePath = path.join(distubeEventsPath, file);
	const eventHandler = require(filePath);
	if (typeof eventHandler === "function") {
		eventHandler(client.distube); // Pass the DisTube instance to the event handler
	} else {
		console.warn(`The DisTube event handler in ${file} does not export a function and was skipped.`);
	}
}

// Load Discord client event handlers
const clientEventsPath = path.join(__dirname, "events", "clientEvents");
const clientEventFiles = fs
	.readdirSync(clientEventsPath)
	.filter((file) => file.endsWith(".js"));

for (const file of clientEventFiles) {
	const filePath = path.join(clientEventsPath, file);
	const eventHandler = require(filePath);
	if (typeof eventHandler === "function") {
		eventHandler(client); // Pass the Discord client instance to the event handler
	} else {
		console.warn(`The Discord event handler in ${file} does not export a function and was skipped.`);
	}
}

// Receives an event from a slash command
client.on(Events.InteractionCreate, async (interaction) => {
	// Returns if the interaction is not a chat input command
	if (!interaction.isChatInputCommand()) return;

	// Get the command from the interaction
	const command = interaction.client.commands.get(interaction.commandName);

	// Shows a message and returns if the command does not exist
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

// Log in to Discord with the token
client.login(token);

// When the client is logged in, log the following message
client.once(Events.ClientReady, (readyClient) => {
	console.log(`✅ Logged in as ${readyClient.user.tag} :D!`);
});


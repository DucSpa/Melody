const { Client, Collection, Events, GatewayIntentBits } = require("discord.js");
const fs = require("node:fs");
const path = require("node:path");
const { token } = require("./config.json");
const { DisTube } = require("distube");
const { YtDlpPlugin } = require("@distube/yt-dlp");
const { env } = require("node:process");

process.env.DISTUBE_DEBUG_LOGS ??= "1"; // Disable DisTube debug logs

// Create a new client instance
const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
});

// yt-dlp for extraction/streaming
client.distube = new DisTube(client, {
    plugins: [new YtDlpPlugin()],
});

/**
 * Silence ALL DisTube error logs (and prevent crashes).
 * If you still want a message in the channel on errors, set:
 * `DISTUBE_NOTIFY_ERRORS=1`
 */
const distubeNotifyErrors = process.env.DISTUBE_NOTIFY_ERRORS === "1";
client.distube.on("error", async (...args) => {
    // DO NOT console.log/console.error here — user requested zero distube logs.

    if (!distubeNotifyErrors) return;

    // Distube versions vary: could be (channel, error) or (error, queue)
    const maybeCtx = args.find((a) => a && typeof a === "object" && (a.textChannel || a.send));
    const textChannel = maybeCtx?.textChannel ?? maybeCtx;

    if (textChannel && typeof textChannel.send === "function") {
        try {
            await textChannel.send(
                "There was an error while playing audio. Try another track or try again later.",
            );
        } catch {
            // ignore send failures
        }
    }
});

// Create a new collection to store the commands
client.commands = new Collection();

// Path to the commands
const commandsPath = path.join(__dirname, "slashCommands");

// Read the contents of the path and filter them
const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    if ("data" in command && "execute" in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.log(
            `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`,
        );
    }
}

// Receives an event from a slash command
client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        // This is NOT a distube log; keep it for debugging command issues.
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

client.distube.on("finish", (queue) => {
    leaveTimeout = setTimeout(() => {
        const voiceChannel = queue.voiceChannel;
        if (voiceChannel) {
            client.distube.voices.leave(voiceChannel);
            queue.textChannel
                ?.send("I have left the voice channel because I was idle for too long! :wave:")
                .catch(() => {});
        }
    }, 60000);
});

client.distube.on("playSong", () => {
    if (leaveTimeout) {
        clearTimeout(leaveTimeout);
        leaveTimeout = null;
    }
});

client.once(Events.ClientReady, (readyClient) => {
    console.log(`✅ Logged in as ${readyClient.user.tag} :D!`);
});

client.login(token);
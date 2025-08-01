# Melody 🎵

A basic Discord music bot that brings tunes to your server.

## Description

Melody is a Discord bot written in JavaScript that allows you to play music in your Discord server's voice channels. It provides a simple and intuitive way to enjoy music with your community.

## Features

- Play music from various sources
- Basic playback controls (play, pause, skip, stop)
- Queue management
- Voice channel integration

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (version 16.x or higher recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- A Discord account and a registered Discord application/bot

## Setup

1. Clone the repository
```bash
git clone https://github.com/DucSpa/Melody.git
cd Melody
```

2. Install dependencies
```bash
npm install
```

3. Configure your bot
- Create a `.config.json` file in the root directory with the following content
- Add your Discord bot token:

```json
{"token":"your_discord_bot_token"}
```

4. Start the bot
```bash
npm start
```

## Usage

Once the bot is running and invited to your server, you can use the following commands:
- `/play` - Play a song
- `/pause` - Pause current playback
- `/resume` - Resume playback
- `/skip` - Skip current song
- `/stop` - Stop playback and clear queue

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Discord.js](https://discord.js.org/) - The Discord API library used
- All contributors who help improve this bot

## Support

If you encounter any problems or have questions, please [open an issue](https://github.com/DucSpa/Melody/issues).

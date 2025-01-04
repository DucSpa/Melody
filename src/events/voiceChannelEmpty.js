import { isVoiceChannelEmpty } from "distube";
import {Client as client} from "discord.js";

client.on("voiceStateUpdate", oldState => {
  if (!oldState?.channel) return;
  const voice = this.voices.get(oldState);
  if (voice && isVoiceChannelEmpty(oldState)) {
    voice.leave();
  }
});
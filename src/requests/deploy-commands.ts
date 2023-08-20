import 'dotenv/config';
import { REST, Routes } from 'discord.js';
import { commandsJSON } from '../utils/discord';

async function deployCommands() {
    const {
        DISCORD_BOT_TOKEN: botToken,
        DISCORD_CLIENT_ID: clientId,
        DISCORD_GUILD_ID: guildId,
        DEPLOY_OR_DELETE: deployOrDelete,
        GLOBAL_OR_GUILD: globalOrGuild,
    } = process.env;

    if (!botToken || !clientId || !guildId || !deployOrDelete || !globalOrGuild) {
        console.error('Invalid env var setup');
        return;
    }

    const rest = new REST().setToken(botToken);

    const route = globalOrGuild === 'GLOBAL'
        ? Routes.applicationCommands(clientId)
        : Routes.applicationGuildCommands(clientId, guildId);

    const body = deployOrDelete === 'DEPLOY'
        ? commandsJSON
        : [];

    await rest.put(route, { body });
}

deployCommands();
import 'dotenv/config';
import { Client, GatewayIntentBits } from 'discord.js';
import { events } from './utils/discord';

const init = () => {
    console.log('Initialising the bot...');
    const { DISCORD_BOT_TOKEN: token } = process.env;

    if (!token?.trim()) {
        console.error('No token environment variable has been provided. Please add it to your `.env` file.');
        return;
    }

    const client = new Client({ intents: [GatewayIntentBits.Guilds] });

    events.forEach(event => {
        event.once
            ? client.once(event.name, (...args: any[]) => event.execute(...args))
            : client.on(event.name, (...args: any[]) => event.execute(...args));
    });

    client.login(token);
};

init();

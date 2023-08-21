import 'dotenv/config';
import { readFileSync } from 'node:fs';
import { Client, GatewayIntentBits } from 'discord.js';
import { events } from './utils/discord';
import { MarkovGeneratorModel } from './models/markov';
import { LOG_FILE_PATH } from './utils/constants';

export const markov = new MarkovGeneratorModel(2, 50, false);

const init = () => {
    console.log('Initialising the bot...');
    const { DISCORD_BOT_TOKEN: token } = process.env;

    if (!token?.trim()) {
        console.error('No token environment variable has been provided. Please add it to your `.env` file.');
        return;
    }

    if (!events.length) {
        console.error('No events were found');
        return;
    }

    const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

    events.forEach(event => {
        event.once
            ? client.once(event.name, (...args: any[]) => event.execute(...args))
            : client.on(event.name, (...args: any[]) => event.execute(...args));
    });

    client.login(token);

    readFileSync(LOG_FILE_PATH)
        .toString()
        .split('\n')
        .forEach(line => !!line && markov.feed(line.trim()));

    console.log('Initialisation complete');
};

init();

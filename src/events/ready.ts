import { Client, Events } from 'discord.js';
import { IEvent } from '../types';

const event: IEvent = {
    name: Events.ClientReady,
    once: true,
    execute(client: Client) {
        if (!client.user) {
            console.error('No client user found');
            return;
        }
        console.log(`Ready! Logged in as ${client.user.tag}`);
    },
};

export default event;

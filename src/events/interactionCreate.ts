import { BaseInteraction, Events } from 'discord.js';
import { IEvent } from '../types';
import { commands } from '../utils/discord';

const event: IEvent = {
    name: Events.InteractionCreate,
    once: true,
    execute: async (interaction: BaseInteraction) => {
        if (!interaction.isChatInputCommand()) return;
        const command = commands.get(interaction.commandName);

        if (!command) {
            console.error(`Command '${interaction.commandName}' does not exist`);
            return;
        }

        await command.execute(interaction);
    },
};

export default event;

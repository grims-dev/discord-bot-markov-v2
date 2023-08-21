import fs from 'node:fs';
import path from 'node:path';
import { Collection, RESTPostAPIChatInputApplicationCommandsJSONBody } from 'discord.js';
import { ICommand, IEvent } from '../types';

const baseDir = __dirname.replace('/utils', '');

// for storing commands within the bot
const getCommands = (): Collection<string, ICommand> => {
    const commands = new Collection<string, ICommand>();
    const foldersPath = path.join(baseDir, 'commands');
    const commandFolders = fs.readdirSync(foldersPath);

    for (const folder of commandFolders) {
        const commandsPath = path.join(foldersPath, folder);
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts'));

        for (const file of commandFiles) {
            const filePath = path.join(commandsPath, file);
            const command: ICommand = require(filePath).default;
            commands.set(command.data.name, command);
        }
    }

    return commands;
}
export const commands = getCommands();

// for collecting as array of JSON payloads for uploading to Discord API
const getCommandsJSON = (): RESTPostAPIChatInputApplicationCommandsJSONBody[] => {
    const commands: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];
    const foldersPath = path.join(baseDir, 'commands');
    const commandFolders = fs.readdirSync(foldersPath);

    for (const folder of commandFolders) {
        const commandsPath = path.join(foldersPath, folder);
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
            const filePath = path.join(commandsPath, file);
            const command: ICommand = require(filePath).default;
            commands.push(command.data.toJSON());
        }
    }

    return commands;
}
export const commandsJSON = getCommandsJSON();

const getEvents = (): IEvent[] => {
    const events: IEvent[] = [];
    const eventsPath = path.join(baseDir, 'events');
    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.ts'));

    eventFiles.forEach(file => {
        const filePath = path.join(eventsPath, file);
        const event = require(filePath).default;
        events.push(event);
    });

    return events;
}
export const events = getEvents();

import { SlashCommandBuilder, CommandInteraction, AutocompleteInteraction } from 'discord.js';

export interface ICommand {
    data: SlashCommandBuilder;
    execute(interaction: CommandInteraction): any;
    autocomplete?(interaction: AutocompleteInteraction): any;
}

export interface IEvent {
    name: string;
    execute(...args: any): any;
    once?: boolean;
}

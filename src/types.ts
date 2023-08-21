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

export type NgramVariations = string[];
export type NgramData = Map<string, NgramVariations>;
export type NgramMap = Map<string, NgramData>;

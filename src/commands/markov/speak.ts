import { CommandInteraction, SlashCommandBuilder, SlashCommandStringOption } from 'discord.js';
import { ICommand } from '../../types';
import { markov } from '../../index';

const command: ICommand = {
	data: new SlashCommandBuilder()
		.setName('speak')
		.setDescription('')
		.setDMPermission(false),
		// .addStringOption(option =>
		// 	option.setName('Search term')
		// )
		// .addBooleanOption(option =>
		// 	option.setName('Enable strict search')
		// ),
	async execute(interaction: CommandInteraction) {
		await interaction.reply('Pong!');
	},
};

export default command;
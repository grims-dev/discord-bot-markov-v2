import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { ICommand } from '../../types';

const command: ICommand = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction: CommandInteraction) {
		await interaction.reply('Pong!');
	},
};

export default command;
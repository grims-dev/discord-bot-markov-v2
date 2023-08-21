import 'dotenv/config';
import fs from 'node:fs';
import { Message, MessageCreateOptions, Events } from 'discord.js';
import { IEvent } from '../types';
import { markov } from '..';
import { matchDiscordCodeBlock, matchWhitespace } from '../utils/regex';
import { randomChoice, tokenize } from '../utils/helpers';
import { LOG_FILE_PATH } from '../utils/constants';

const {
    BOT_COMMAND,
    RANDOM_RESPONSE_CHANCE,
    RANDOM_RESPONSE_COOLDOWN_MS
} = process.env;

const botCommand = BOT_COMMAND || '.speak';
const randomResponseChance = parseInt(RANDOM_RESPONSE_CHANCE || '0') / 100 || 0.015;
const randomResponseChanceLower = randomResponseChance * 0.75;
const randomResponseCooldownMS = parseInt(RANDOM_RESPONSE_COOLDOWN_MS || '0') * 1000 || 3000;
const messageOptions: MessageCreateOptions = {
    allowedMentions: { parse: [] },
}
let timeCheck = new Date().getTime();
let lastAuthorId = '';

const event: IEvent = {
    name: Events.MessageCreate,
    execute: async (message: Message) => {
        // handle manual command
        console.log(message);
        if (message.content.startsWith(botCommand)) {
            await message.channel.send({
                ...messageOptions,
                content: markov.generate(message.content.replace(botCommand, '')),
            });
            return;
        }

        // not a command - add regular message to current markov storage
        // ignore DMs and fellow bots
        if (!message.guild || message.author.bot) return;

        const cleanMessage = message.content
            .trim()
            .replace(matchDiscordCodeBlock, '')
            .replace(matchWhitespace, ' ');

        if (cleanMessage.split(' ').length >= 2) {
            fs.appendFile(LOG_FILE_PATH, '\n' + cleanMessage, (err) => { if (err) console.error(err); });
            markov.feed(cleanMessage);
        }

        // bonus: chance of replying to non-request after certain amount of time has passed
        const chance = message.author.id === lastAuthorId ? randomResponseChanceLower : randomResponseChance;
        const currentTime = new Date().getTime();
        if (Math.random() < chance && timeCheck < currentTime - randomResponseCooldownMS) {
            await message.channel.send({
                ...messageOptions,
                content: markov.generate(randomChoice(tokenize(cleanMessage))),
            });
            timeCheck = currentTime;
        }

        lastAuthorId = message.author.id;
    },
};

export default event;

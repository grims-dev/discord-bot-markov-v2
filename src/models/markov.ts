import { tokenize, clean, randomChoice, getNLastItems, randomChoiceFromMap, randomKeyFromMap } from '../utils/helpers';
import { DISCORD_MAX_MESSAGE_LENGTH } from '../utils/constants';
import { NgramData, NgramMap } from '../types';

export class MarkovGeneratorModel {
    /**
     * @param n - How many words make up a single ngram
     */
    readonly n: number;
    /**
     * @param maxWordCount - Maximum number of words that will be generated in a string
     */
    readonly maxWordCount: number;
    /**
     * @param ngramMap - Dictionary storage of ngrams; each ngram is the key, an array of possible next strings are the values
     */
    readonly ngramMap: NgramMap;
    /**
     * @param isStrictMarkov - Determines strictness of adherence to Markov model (enables weighted options)
     */
    readonly isStrictMarkov: boolean;

    constructor(n = 2, maxWordCount = 50, isStrictMarkov = false) {
        this.n = n;
        this.maxWordCount = maxWordCount;
        this.ngramMap = new Map();
        this.isStrictMarkov = isStrictMarkov;
    }

    /**
     * Feed in new text to the ngram storage to be generated from
     * @param input - new string to feed
     * @returns void
     */
    feed(input: string): void {
        const inputTokens = tokenize(input);
        if (inputTokens.length < this.n) return;

        const numberOfNgrams = inputTokens.length - this.n;
        for (let i = 0; i < numberOfNgrams; i++) {
            const ngram = inputTokens.slice(i, i + this.n).join(' ');
            const cleanNgram = clean(ngram);
            const nextWord = inputTokens[i + this.n];

            const ngramVariations =
                this.ngramMap.get(cleanNgram) ??
                this.ngramMap.set(cleanNgram, new Map()).get(cleanNgram)!;

            const currentNgramVariation =
                ngramVariations.get(ngram) ??
                ngramVariations.set(ngram, []).get(ngram)!;

            if (this.isStrictMarkov) {
                currentNgramVariation.push(nextWord);
            } else if (!currentNgramVariation.includes(nextWord)) {
                currentNgramVariation.push(nextWord);
            }
        }
    }

    /**
     * Generate text from the information ngrams
     * @param searchTerm - term to search for
     * @returns string - generated text
     */
    generate(searchTerm: string = ''): string {
        const output: string[] = [];
        let currentNgram: string = '';

        // handle search
        const trimSearchTerm = searchTerm.trim();
        if (trimSearchTerm) {
            const searchTokens = tokenize(trimSearchTerm);

            for (let i = 0; i < Math.min(searchTokens.length, this.maxWordCount); i++) {
                const isFirstRun = i === 0;
                const searchNgram = searchTokens.slice(i, i + this.n).join(' ');
                const cleanSearchNgram = clean(searchNgram);
                let searchedNgramData: NgramData | undefined = this.ngramMap.get(cleanSearchNgram);
                if (!searchedNgramData) {
                    if (isFirstRun) {
                        // try to find matching first word ngrams
                        const firstWord = tokenize(cleanSearchNgram)[0];
                        let matchingFirstWordKeys = [];
                        for (const key of this.ngramMap.keys()) {
                            if (key.split(' ')[0] === firstWord) matchingFirstWordKeys.push(key);
                        }
                        if (!matchingFirstWordKeys.length) break;
                        searchedNgramData = this.ngramMap.get(randomChoice(matchingFirstWordKeys));
                    }
                }
                if (!searchedNgramData) break;

                const [firstWord, ...restOfWords] = tokenize(randomKeyFromMap(searchedNgramData));
                if (isFirstRun) output.push(firstWord);
                output.push(...restOfWords);
            }
        }

        if (output.length) {
            currentNgram = getNLastItems(output, this.n);
        } else {
            // no search/search results - grab random start
            currentNgram = randomKeyFromMap(randomChoiceFromMap(this.ngramMap));
            output.push(...tokenize(currentNgram));
        }

        // handle remainder of generation
        const dupeNgramStorage: Set<string> = new Set();
        const remainingWordCount = this.maxWordCount - output.length;
        for (let i = 0; i < remainingWordCount; i++) {
            // prevent duplicate/repeats
            if (dupeNgramStorage.has(currentNgram)) break;
            dupeNgramStorage.add(currentNgram);

            // index the ngram storage based on current ngram
            const currentNgramClean: string = clean(currentNgram);
            const ngramData = this.ngramMap.get(currentNgramClean);
            if (!ngramData) break;
            const selectedVariation = ngramData.get(currentNgram) ?? randomChoiceFromMap(ngramData);
            if (!selectedVariation) break;

            // choose a random next word and reassign current ngram
            output.push(randomChoice(selectedVariation));
            currentNgram = getNLastItems(output, this.n);
        }

        return output.join(' ').substring(0, DISCORD_MAX_MESSAGE_LENGTH);
    }
};

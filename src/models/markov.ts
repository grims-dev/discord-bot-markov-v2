import { tokenize, clean, randomChoice, getNLastItems, getNthWord, removeArrayItemIfPresent } from '../utils/helpers';

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
    readonly ngramMap: Map<string, string[]>;

    constructor(n = 2, maxWordCount = 50) {
        this.n = n;
        this.maxWordCount = maxWordCount;
        this.ngramMap = new Map();
    }

    /**
     * Feed in new text to the Markov chain
     * @param input - new string to feed
     * @returns void
     */
    feed(input: string): void {
        const inputTokens = tokenize(input);
        if (inputTokens.length < this.n) return;

        const numberOfNgrams = inputTokens.length - this.n;
        for (let i = 0; i < numberOfNgrams; i++) {
            const ngram = inputTokens.slice(i, i + this.n).join(' ');

            // initialise if doesn't exist
            if (!this.ngramMap.get(ngram)) {
                this.ngramMap.set(ngram, []);
            }

            // now we can safely grab as array, and
            // retrieve next word to add to the list
            const currentNgramValue = this.ngramMap.get(ngram)!;
            const nextWord = inputTokens[i + this.n];
            if (!currentNgramValue.includes(nextWord)) {
                currentNgramValue.push(nextWord);
            }
        }
    }

    /**
     * Generate text from the information ngrams
     * @param searchTerm - term to search for
     * @param isStrict - adhere to original punctuation or not
     * @returns string - generated text
     */
    generate(searchTerm: string = '', isStrict: boolean = false): string {
        const ngramValues: string[] = [...this.ngramMap.keys()];
        const output: string[] = [];
        let currentNgram: string = '';

        // handle search
        const trimmedSearchTerm = searchTerm.trim();
        if (trimmedSearchTerm.length) {
            console.log(`ciaran — generate — trimmedSearchTerm::`, trimmedSearchTerm);
            const searchTokens: string[] = (
                isStrict
                    ? tokenize(trimmedSearchTerm)
                    : tokenize(clean(trimmedSearchTerm))
            ).splice(this.maxWordCount);

            for (let i = 0; i < searchTokens.length - this.n; i++) {
                const isFirstRun: boolean = i === 0;
                const searchNgram: string = searchTokens.slice(i, i + this.n).join(' ');

                const searchResultsSimilar: string[] = ngramValues.filter(ngram => (isStrict ? ngram : clean(ngram)).startsWith(searchNgram));

                if (!searchResultsSimilar && !isFirstRun) break;

                // on first run, try first word
                if (isFirstRun) {
                    searchResultsSimilar.push(...ngramValues.filter(ngram =>
                        getNthWord((isStrict ? ngram : clean(ngram)), 1)
                            .startsWith(getNthWord(searchNgram, 1))
                    ));
                    if (!searchResultsSimilar) break;
                }

                const searchResultsExact: string[] = [];
                if (searchResultsSimilar) {
                    searchResultsExact.push(...searchResultsSimilar.filter(ngram => ngram === searchNgram));
                }

                const searchResultTokens = tokenize(randomChoice(searchResultsExact || searchResultsSimilar));
                if (isFirstRun) output.push(searchResultTokens[0]);
                output.push(searchResultTokens[1]);
            }
        } else {
            currentNgram = randomChoice(ngramValues);
            output.push(currentNgram);
        }

        // handle remainder of generation
        const remainingWordCount = this.maxWordCount - output.length;
        for (let i = 0; i < remainingWordCount; i++) {
            const currentNgramClean: string = clean(currentNgram);
            const resultsSimilar: string[] = ngramValues.filter(ngram => clean(ngram).startsWith(currentNgramClean));
            const resultsExact: string[] = [];
            if (resultsSimilar) {
                resultsExact.push(...resultsSimilar.filter(ngram => clean(ngram) === currentNgramClean));
            }

            const nextNgram: string = randomChoice(resultsExact || resultsSimilar);

            const possibleNextTokens = this.ngramMap.get(nextNgram);
            if (!possibleNextTokens) break;
            output.push(randomChoice(possibleNextTokens));

            // prevent duplicates for this generation
            removeArrayItemIfPresent(ngramValues, nextNgram);

            // new ngram for next iteration of loop
            currentNgram = getNLastItems(output, this.n);
            console.log(`ciaran — generate — currentNgram::`, currentNgram);
        }

        return output.join(' ');
    }
};

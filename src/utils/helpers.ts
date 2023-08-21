import { matchAlphanumeric, matchPunctuation, matchWhitespace } from './regex';

/**
 * Splits a given string into an array of tokens, removing all whitespace
 * @param input - Text to tokenize
 * @returns array of tokens
 */
export const tokenize = (input: string): string[] => input.split(matchWhitespace);

/**
 * Cleans an input and makes it lowercase. If there's nothing left, do the opposite and just return non-alphanumeric characters
 * @param input - Text to clean
 * @returns clean string
 */
export const clean = (input: string): string => {
    return input.replace(matchPunctuation, '').toLowerCase() || input.replace(matchAlphanumeric, '');
}

/**
 * Selects a random item from an array
 * @param choices - array of strings to choose from
 * @returns the chosen item
 */
export const randomChoice = (choices: string[]): string => choices[Math.floor(Math.random() * choices.length)];

/**
 * Selects a random item from a Map
 * @param map - map to choose from
 * @returns the chosen item
 */
export const randomChoiceFromMap = <T>(map: Map<string, T>): T => {
    let index = 0;
    let chosenKey = '';
    const indexToChoose = Math.floor(Math.random() * map.size);
    for (const key of map.keys()) {
        if (index++ === indexToChoose) {
            chosenKey = key;
            break;
        }
    }
    return map.get(chosenKey)!;
}

/**
 * Selects a random key from a Map
 * @param map - map to choose from
 * @returns the chosen key
 */
export const randomKeyFromMap = <T>(map: Map<string, T>): string => {
    let index = 0;
    let chosenKey = '';
    const indexToChoose = Math.floor(Math.random() * map.size);
    for (const key of map.keys()) {
        if (index++ === indexToChoose) {
            chosenKey = key;
            break;
        }
    }
    return chosenKey;
}

/**
 * Retrieves a section of items from the end of an array
 * @param allItems - an array to pull from
 * @param n - number of items to retrieve (default 2)
 * @returns a concatenated string
 */
export const getNLastItems = (allItems: string[], n: number = 2): string => {
    return allItems.slice(allItems.length - n, allItems.length).join(' ');
}

/**
 * Removes a specified item from an array
 * @param array - array to remove from
 * @param itemToRemove - item to remove from array
 */
export const removeArrayItemIfPresent = (array: string[], itemToRemove: string): void => {
    const index = array.indexOf(itemToRemove);
    if (index > -1) array = array.splice(index, 1);
}

/**
 * Selects a word based on spaces
 * @param input - string to select from
 * @param n - word to choose (not index - eg. 1 for first word)
 * @returns the word or empty string
 */
export const getNthWord = (input: string, n: number): string => input.split(' ')[n - 1] ?? '';

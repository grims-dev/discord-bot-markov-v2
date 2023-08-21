export const matchPunctuation = /[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,\-.\/:;<=>?@\[\]^_`{|}~]/g;
export const matchAlphanumeric = /[A-z 0-9]/g;
export const matchWhitespace = /\s+/g;
export const matchDiscordCodeBlock = /(```)(.*?)(```)/gims;

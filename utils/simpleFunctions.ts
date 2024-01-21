import { FetchError } from 'ofetch';

export enum RndStrAlphabet {
  useUpper = 1 << 0,
  useLower = 1 << 1,
  useNumbers = 1 << 2,
  useAlphaNum = (1 << 3) - 1,

  useSymbols = 1 << 3,
  useAll = (1 << 4) - 1,
}

const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const lower = 'abcdefghijklmnopqrstuvwxyz';
const numbers = '0123456789';
const symbols = '!@#$%^&*()/*+';

export function randomString(alphabet: RndStrAlphabet, length: number) {
  let characters = '';
  if (!alphabet) throw Error('No alphabet options provided');

  if (alphabet & RndStrAlphabet.useUpper)  characters += upper;
  if (alphabet & RndStrAlphabet.useLower)  characters += lower;
  if (alphabet & RndStrAlphabet.useNumbers) characters += numbers;
  if (alphabet & RndStrAlphabet.useSymbols) characters += symbols;

  let out = '';
  for (let i = 0; i < length; i++)
    out += characters[Math.floor(Math.random() * characters.length)];
  return out;
}


export const createSimpleError = (e: any, noErrorText='Неизвестная ошибка') => (e instanceof Error) ? e : Error((e as any)?.message || noErrorText);
export const createFetchError = (e: any) => (e instanceof FetchError) ? e : createSimpleError(e);

export enum RndStrAlphabet {
  useUpper = 1 << 0,
  useLower = 1 << 1,
  useNumbers = 1 << 2,
  useAll = (1 << 3) - 1
}

const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const lower = 'abcdefghijklmnopqrstuvwxyz';
const numbers = '0123456789';

export function randomString(alphabet: RndStrAlphabet, length: number) {
  let characters = '';
  if (!alphabet) throw Error('No alphabet options provided');

  if (alphabet & RndStrAlphabet.useUpper)  characters += upper;
  if (alphabet & RndStrAlphabet.useLower)  characters += lower;
  if (alphabet & RndStrAlphabet.useNumbers) characters += numbers;

  let out = '';
  for (let i = 0; i < length; i++)
    out += characters[Math.floor(Math.random() * length)];
  return out;
}

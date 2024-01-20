const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export function randomString(length: number) {
  let out = '';
  for (let i = 0; i < length; i++)
    out += characters[Math.floor(Math.random() * length)];
  return out;
}
export const allowedEmoteTypes = ['face', 'front', 'back', 'basic'] as const;
export type AllowedEmoteTypes = (typeof allowedEmoteTypes)[number];

export const allowedInteractionTypes = ['vibration', 'oscillation'] as const;
export type AllowedInteractionTypes = (typeof allowedInteractionTypes)[number];

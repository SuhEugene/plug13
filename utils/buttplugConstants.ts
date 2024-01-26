export const allowedEmoteTypes = ['face', 'front', 'back', 'basic'] as const;
export type AllowedEmote = (typeof allowedEmoteTypes)[number];

export const allowedInteractionTypes = ['vibration', 'oscillation'] as const;
export type AllowedInteraction = (typeof allowedInteractionTypes)[number];

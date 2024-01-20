import type { H3Event, EventHandlerRequest } from 'h3';

export default async (event: H3Event<EventHandlerRequest>, tokenGrant: DiscordAccessTokenGrant): Promise<DiscordUser> => {
  try {
    const data = await $fetch<DiscordUser>("https://discord.com/api/users/@me", {
      method: 'GET',
      headers: { Authorization: `${tokenGrant.token_type} ${tokenGrant.access_token}` }
    });

    return data;
  } catch (e) {
    console.error(e, (e as any).data);
    throw createError({
      statusCode: 400,
      message: "Токен невалиден",
      data: (e as any).data
    });
  }
}
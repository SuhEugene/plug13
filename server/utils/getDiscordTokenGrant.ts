import type { H3Event, EventHandlerRequest } from 'h3';

export default async (event: H3Event<EventHandlerRequest>): Promise<DiscordAccessTokenGrant> => {
  const { discordClientSecret, public: { origin, discordClientId }} = useRuntimeConfig(event);

  const body = await readBody<{ code?: string }>(event);
  if (!body.code) throw createError({
    statusCode: 400,
    message: "Отсутствует код авторизации"
  });

  const discordBody = {
    grant_type: "authorization_code",
    code: body.code,
    redirect_uri: `${origin}/`,
    client_id: discordClientId,
    client_secret: discordClientSecret
  };

  let discordBodyArr = [];
  for (const key in discordBody)
    discordBodyArr.push(`${encodeURIComponent(key)}=${encodeURIComponent(discordBody[key as keyof typeof discordBody])}`);
  
  try {
    const data = await $fetch<DiscordAccessTokenGrant>("https://discord.com/api/oauth2/token", {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: discordBodyArr.join('&')
    });

    return data;
  } catch (e) {
    console.error(e, (e as any).data);
    throw createError({
      statusCode: 400,
      message: "Не удалось получить токен",
      data: (e as any).data
    });
  }
}

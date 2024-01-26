import { allowedEmoteTypes } from "~/utils/buttplugConstants";

const codeRegex = /^([A-Za-z0-9]{10}|([A-Za-z0-9]{5}-[A-Za-z0-9]{5}))$/;

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  if (!body.code || !body.key) return createError({
    statusCode: 400,
    message: "Invalid request body"
  });

  const byondSecret = useRuntimeConfig().byondSecret;
  if (!body.secret || body.secret !== byondSecret) return createError({
    statusCode: 400,
    message: "Invalid secret"
  });

  if (!body.emote || !allowedEmoteTypes.includes(body.emote)) return createError({
    statusCode: 400,
    message: "Invalid emote"
  });

  if (!codeRegex.test(body.code)) return createError({
    statusCode: 400,
    message: "Invalid code"
  });

  if(event.context.appSocket)
    event.context.appSocket
      .in(body.code.replace("-", "").toUpperCase())
      .emit("emote", { type: body.emote, key: body.key });

  return;
})

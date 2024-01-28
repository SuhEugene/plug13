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

  if (!body.strength || typeof body.strength !== 'number') return createError({
    statusCode: 400,
    message: "Invalid strength"
  });

  // На вход мы должны получить число [1-100], а на выходе дать (0-1]
  const strength = Math.floor(body.strength) / 100;

  if (strength <= 0 || strength > 1) return createError({
    statusCode: 400,
    message: "Strength is too low or too big"
  });

  console.log(!body.duration, typeof body.duration, body.duration);

  if (!body.duration || typeof body.duration !== 'number') return createError({
    statusCode: 400,
    message: "Invalid duration"
  });

  const duration = Math.floor(body.duration) * 100; // Конвертация из децисекунд в миллисекунды

  // Клиент в любом случае обрежет меньше, чем максимум здесь, если нужно
  // Здесь мы отправляем назад только с тотальным нонсенсом
  if (duration <= 0 || duration > 15000) return createError({
    statusCode: 400,
    message: "Duration is too low or too big"
  });

  if(event.context.appSocket)
    event.context.appSocket
      .in(body.code.replace("-", "").toUpperCase())
      .emit("emote", {
        type: body.emote,
        strength, duration,
        key: body.key
      });

  return;
})

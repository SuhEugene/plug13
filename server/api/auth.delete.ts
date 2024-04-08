import logDated from "../utils/logger";

export default defineEventHandler(async (event) => {
  const user = await useAuth(event);
  deleteCookie(event, 'token');

  logDated(`${user.username} logged out`);

  return;
})

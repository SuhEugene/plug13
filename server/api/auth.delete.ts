export default defineEventHandler((event) => {
  useAuth(event);
  deleteCookie(event, 'token');
  return;
})

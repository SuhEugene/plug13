import useAuth from "../utils/useAuth"

export default defineEventHandler((event) => {
  const user = useAuth(event);
  return user;
})

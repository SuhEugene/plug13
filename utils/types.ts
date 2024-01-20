interface DiscordAccessTokenGrant {
  access_token: string
  expires_in: number
  refresh_token: string
  scope: string
  token_type: string
}

interface DiscordUser {
  id: string
  username: string
  discriminator: string
  global_name?: string
  avatar?: string
  bot?: boolean
  system?: boolean
  mfa_enabled?: boolean
  banner?: string
  accent_color?: number
  locale?: string
  verified?: boolean
  email?: string
  flags?: number
  premium_type?: number
  public_flags?: number
  avatar_decoration?: string
}

interface User {
  id: string
}

interface ConnectionString {
  value: string
  createdAt: string
}
export function getAdminSessionSecret(): string {
  return (process.env.ADMIN_SESSION_SECRET ?? process.env.SESSION_SECRET ?? "").trim();
}

export function getAdminPasswordHash(): string {
  return (process.env.ADMIN_PASSWORD_HASH ?? "").trim();
}

export function getAdminPasswordFallback(): string {
  return (process.env.ADMIN_PASSWORD ?? "").trim();
}

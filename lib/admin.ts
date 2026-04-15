const ADMIN_EMAIL =
  process.env.ADMIN_EMAIL ?? "ihamoglu@gmail.com";

export function isAdminEmail(email?: string | null) {
  return (
    !!email &&
    email.trim().toLowerCase() === ADMIN_EMAIL.trim().toLowerCase()
  );
}

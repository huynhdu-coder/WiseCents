export function isAcademicEmail(email) {
  if (!email || !email.includes("@")) return false;

  const domain = email.split("@")[1].toLowerCase().trim();

  if (domain.endsWith(".edu")) return true;

  const knownAcademicDomains = new Set([
    "uc.edu",
    "osu.edu",
    "mit.edu",
  ]);

  return knownAcademicDomains.has(domain);
}
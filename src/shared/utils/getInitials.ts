export const getInitials = (name: string) => {
  const parts = name.trim().split(" ");
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }

  return parts
    .map((p) => p[0])
    .join("")
    .toUpperCase();
};

export function sanitizeHtml(text: string) {
  return text.replace(/<[^>]+>/g, "");
}

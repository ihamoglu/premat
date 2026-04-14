export function topicToSlug(topic: string) {
  return topic
    .toLocaleLowerCase("tr")
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ı/g, "i")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function findTopicBySlug(topics: string[], slug: string) {
  return topics.find((topic) => topicToSlug(topic) === slug) || null;
}

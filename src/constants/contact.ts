export const CONTACT_TOPICS = [
  "Hợp tác quảng cáo",
  "Góp ý bài viết",
  "Chia sẻ câu chuyện",
  "Lời chào nhẹ nhàng",
] as const;

export const CONTACT_TOPIC_OPTIONS = CONTACT_TOPICS.map((topic) => ({
  label: topic,
  value: topic,
}));

export function isContactTopic(value: string) {
  return CONTACT_TOPICS.includes(value as (typeof CONTACT_TOPICS)[number]);
}

export const formatDate = (date) => {
  if (!date) return "";

  const d = new Date(date);
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };

  return d.toLocaleDateString("en-US", options);
};

export const truncateText = (text, maxLength) => {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
};

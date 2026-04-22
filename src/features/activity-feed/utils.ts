export const formatTimestamp = (timestamp: string) => {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(timestamp));
};

export const truncateBody = (body: string, length = 140) => {
  if (body.length <= length) {
    return body;
  }

  return `${body.slice(0, length).trimEnd()}...`;
};
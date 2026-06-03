const dateFormatter = new Intl.DateTimeFormat('en', {
  month: 'short',
  day: 'numeric',
  year: 'numeric'
});

export function formatDate(value: string | Date) {
  return dateFormatter.format(new Date(value));
}

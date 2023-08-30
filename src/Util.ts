export function convertToDateTimeLocal(date: Date | undefined) {
  if (!date) return undefined;
  const result = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  return result;
}

function pad(num: number) {
  return String(num).padStart(2, "0");
}

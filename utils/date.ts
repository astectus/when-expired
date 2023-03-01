export function differenceInDays(date1: Date, date2: Date) {
  const differenceInTime = date2.getTime() - date1.getTime();

  return Math.ceil(differenceInTime / (1000 * 3600 * 24));
}

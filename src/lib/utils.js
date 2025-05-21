export const formatTime = (minutes) => {
  const baseHour = 9;
  const baseMinute = 15;
  let totalMinutes = baseHour * 60 + baseMinute + minutes;
  let hours = Math.floor(totalMinutes / 60);
  let mins = totalMinutes % 60;

  const ampm = hours >= 12 ? "PM" : "AM";
  if (hours > 12) hours -= 12;
  if (hours === 0) hours = 12;

  return `${hours}:${mins.toString().padStart(2, "0")} ${ampm}`;
};

// Set the base time as 9:15 AM today
export const getBaseDate = () => {
  const now = new Date();
  now.setHours(9, 15, 0, 0); // 9:15 AM
  return now;
};

// Convert minutes offset to ISO string
export const getISOTime = (offsetMinutes) => {
  const base = getBaseDate();
  const target = new Date(base.getTime() + offsetMinutes * 60000);
  return target.toISOString();
};

export function roundToNearest50(num) {
  const remainder = num % 50;
  if (remainder < 25) {
    return num - remainder; // round down
  } else {
    return num + (50 - remainder); // round up
  }
}

export function findNearest(array, currentPrice) {
  // Convert all strings in the array to numbers
  const numbers = array.map(Number);

  // Use reduce to find the closest number
  return numbers.reduce((prev, curr) =>
    Math.abs(curr - currentPrice) < Math.abs(prev - currentPrice) ? curr : prev
  );
}

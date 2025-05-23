export interface TimezoneOption {
  value: string; // IANA timezone name
  label: string; // User-friendly label
}

export const US_TIMEZONES: TimezoneOption[] = [
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'America/Anchorage', label: 'Alaska Time (AKT)' },
  { value: 'Pacific/Honolulu', label: 'Hawaii Time (HT)' },
];

export const INDIA_TIMEZONE: TimezoneOption = {
  value: 'Asia/Kolkata',
  label: 'India', // Simplified label as per design
};

export const getFormattedDateTime = (date: Date, ianaTimezone: string) => {
  const timeOptions: Intl.DateTimeFormatOptions = {
    timeZone: ianaTimezone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  };
  const dateOptions: Intl.DateTimeFormatOptions = {
    timeZone: ianaTimezone,
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  };
  
  const timeString = date.toLocaleTimeString('en-US', timeOptions);
  const dateString = date.toLocaleDateString('en-US', dateOptions);
  return { timeString, dateString };
};

export const isDaylight = (date: Date, ianaTimezone: string): boolean => {
  // Use 'en-GB' or specify hourCycle for 24-hour format to avoid AM/PM parsing issues
  const hour = parseInt(
    date.toLocaleTimeString('en-GB', {
      timeZone: ianaTimezone,
      hour: '2-digit',
      hourCycle: 'h23', 
    }),
    10
  );
  // Consider daylight from 6 AM (inclusive) to 6 PM (exclusive)
  return hour >= 6 && hour < 18;
};

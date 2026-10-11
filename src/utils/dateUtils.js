/**
 * Utility functions for date and time handling in Smart Ration Queue
 */

export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
};

export const formatDateFull = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
};

export const toISODate = (date) => {
  if (!date) return '';
  if (typeof date === 'string') {
    // If it's already YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) return date;
    const d = new Date(date);
    return isNaN(d.getTime()) ? date : d.toISOString().split('T')[0];
  }
  return date.toISOString().split('T')[0];
};

export const formatTime = (timeString) => {
  if (!timeString) return '';
  // Handles "09:00:00" or "09:00"
  const parts = timeString.split(':');
  if (parts.length >= 2) {
    let hours = parseInt(parts[0], 10);
    const minutes = parts[1];
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // '0' should be '12'
    const padHour = hours < 10 ? `0${hours}` : hours;
    return `${padHour}:${minutes} ${ampm}`;
  }
  return timeString;
};

export const formatSlotTime = (startTime, endTime) => {
  if (!startTime) return 'N/A';
  const start = formatTime(startTime);
  if (!endTime) return start;
  const end = formatTime(endTime);
  return `${start} - ${end}`;
};

/**
 * Calculates end time exactly 30 minutes after start time
 * Example: "09:00:00" -> "09:30:00"
 */
export const calculateEndTime = (startTime) => {
  if (!startTime) return '';
  const parts = startTime.split(':');
  if (parts.length < 2) return '';
  let hours = parseInt(parts[0], 10);
  let minutes = parseInt(parts[1], 10);

  minutes += 30;
  if (minutes >= 60) {
    hours += Math.floor(minutes / 60);
    minutes = minutes % 60;
  }

  const hStr = String(hours).padStart(2, '0');
  const mStr = String(minutes).padStart(2, '0');
  const sStr = parts[2] ? parts[2] : '00';

  return `${hStr}:${mStr}:${sStr}`;
};

export const calculateRecommendedArrival = (startTime) => {
  if (!startTime) return 'At slot start';
  const parts = startTime.split(':');
  if (parts.length < 2) return 'At slot start';
  let hours = parseInt(parts[0], 10);
  let minutes = parseInt(parts[1], 10);

  const startM = minutes + 5;
  const endM = minutes + 15;

  const formatHMPart = (h, m) => {
    let finalH = h + Math.floor(m / 60);
    let finalM = m % 60;
    const ampm = finalH >= 12 ? 'PM' : 'AM';
    finalH = finalH % 12 || 12;
    return `${String(finalH).padStart(2, '0')}:${String(finalM).padStart(2, '0')} ${ampm}`;
  };

  return `${formatHMPart(hours, startM)} - ${formatHMPart(hours, endM)}`;
};

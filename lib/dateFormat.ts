export const formatDateForInput = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based, so we add 1
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

export const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() is zero-based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
};



export const formatTimeAgoWithoutAgo = (date: string): string => {
    const now = new Date();
    const then = new Date(date);
  
    // Calculate the difference in milliseconds
    const seconds = Math.floor((now.getTime() - then.getTime()) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30); // Approximate month length
    const years = Math.floor(days / 365); // Approximate year length
  
    if (years >= 1) return `${years}y`;
    if (months >= 1) return `${months}mon`;
    if (days >= 1) return `${days}d`;
    if (hours >= 1) return `${hours}h`;
    if (minutes >= 1) return `${minutes}m`;
    return `${seconds < 0 ? 0 : seconds}s`;
};

export const formatTimeAgo = (timestamp: string): string => {
    const now = new Date();
    const then = new Date(timestamp);
  
    // Calculate the difference in milliseconds
    const seconds = Math.floor((now.getTime() - then.getTime()) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30); // Approximate month length
    const years = Math.floor(days / 365); // Approximate year length
  
    if (years >= 1) return `${years} year${years>1?'s':''} ago`;
    if (months >= 1) return `${months} mon${months>1?'s':''} ago`;
    if (days >= 1) return `${days} day${days>1?'s':''} ago`;
    if (hours >= 1) return `${hours} hour${hours>1?'s':''} ago`;
    if (minutes >= 1) return `${minutes} min${minutes>1?'s':''} ago`;
    return `${seconds < 0 ? 0 : seconds} sec${seconds>1?'s':''} ago`;
};

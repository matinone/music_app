export default {
  formatTime(time_seconds) {
    const minutes = Math.floor(time_seconds / 60) || 0;
    const seconds = Math.round(time_seconds - minutes * 60) || 0;

    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  },
};

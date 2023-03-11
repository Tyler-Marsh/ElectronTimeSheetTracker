export const roundingFun = (minutes: number) => {
  const leftOverMinutes = minutes % 60;
  const roundedMinutes = Math.round(leftOverMinutes / 15) * 15;
  if (roundedMinutes === 60) {
    // make hours round up.
    const hours = Math.round(minutes / 60);
    return hours;
  }
  let newHours = Math.floor(minutes / 60);
  newHours += roundedMinutes / 60;

  return newHours;
};

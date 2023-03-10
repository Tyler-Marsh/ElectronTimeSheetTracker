
  export const roundingFun = (minutes: number) => {
    let leftOverMinutes = minutes % 60;
    let roundedMinutes = Math.round(leftOverMinutes/15) * 15;
    if (roundedMinutes === 60) {
      // make hours round up.
      let hours = Math.round(minutes/60);
      return hours;
    }
    let newHours = Math.floor(minutes/60);
    newHours+= roundedMinutes/60;
   
    return newHours;
  
  }
import { ShiftModel } from "../../Render/Models/ShiftModel";

export async function SimLoading(): Promise<string> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("resolved");
    }, 250);
  });
}

export function FormShift(arg: ShiftModel | any): ShiftModel {
  // Start End fk_EmployeeId Comments Extra
  const Start: string = arg.Start;
  const id: number = arg.pk_ShiftId;
  const End: string = arg.End;
  const Comments: string = arg.comments;
  const Extra: number = arg.extra;
  const employeeId: number = arg.fk_EmployeeID;
  return {
    Start,
    End,
    pk_ShiftId: id,
    Comments,
    Extra,
    fk_EmployeeId: employeeId,
  };
}

export class TimeParser {
  // LOOP and keep concatenating
  // if the first part isnt a number return fail/ default
  // loop through and concatenate numbers and the letters

  parse(time: string): string {
    if (Number.isNaN(parseInt(time[0]))) {
      return "";
    }

    const split = time
      .trim()
      .split(" ")
      .join("")
      .toLocaleLowerCase()
      .split(":");
    if (split.length === 1) {
      return this.parseFinal(this.parseNoColon(split));
    }

    return this.parseFinal(this.parseWithColon(split));
  }

  /*Make it all*/

  private parseNoColon(time: string[]) {
    // loop until no numbers
    let timeString = "";
    let count = 0;
    for (let i = 0; i < time[0].length; i++) {
      if (Number.isInteger(parseInt(time[0][i])) && count < 4) {
        timeString += time[0][i];
        count++;
      }
      if (time[0][i] === "a" || time[0][i] === "p") {
        timeString += time[0][i];
      }
    }
    return timeString;
  }

  private parseWithColon(time: string[]) {
    let timeString = "";
    let firstCount = 1;
    if (Number.isNaN(parseInt(time[0][0]))) {
      return "";
    }

    for (let i = 0; i < time[0].length; i++) {
      if (Number.isInteger(parseInt(time[0][i])) && firstCount < 4) {
        timeString += time[0][i];
        firstCount += 1;
      }
      if (Number.isNaN(parseInt(time[0][i]))) {
        if (time[0][i] === "p" || time[0][i] === "a") {
          timeString += time[0][i];
          return timeString;
        } else {
          return timeString;
        }
      }
      if (firstCount === 4) {
        return timeString;
      }
    }

    let secondCount = 0;
    if (timeString.length <= 2) {
      for (let i = 0; i < time[1].length; i++) {
        if (Number.isInteger(parseInt(time[1][i])) && secondCount < 3) {
          timeString += time[1][i];
          secondCount += 1;
        }
        if (Number.isNaN(parseInt(time[1][i]))) {
          if (time[1][i] === "p" || time[1][i] === "a") {
            timeString += time[1][i];
            return timeString;
          } else {
            return timeString;
          }
        }
      }

      return timeString;
    }
  }

  private parseFinal(time: string) {
    let suffix = "";
    const lastChar = time.toLocaleLowerCase().charAt(time.length - 1);
    if (lastChar === "a") {
      suffix = "am";
      time = time.substring(0, time.length - 1);
    }
    if (lastChar === "p") {
      suffix = "pm";
      time = time.substring(0, time.length - 1);
    }

    switch (time.length) {
      case 0: {
        return "";
      }
      case 1: {
        return "0" + time + ":00 " + suffix;
      }
      case 2: {
        return this.roundHours(time) + ":00 " + suffix;
      }
      case 3: {
        return (
          "0" +
          this.roundHours(time.substring(0, 1)) +
          ":" +
          this.roundMinutes(time.substring(1, 3)) +
          " " +
          suffix
        );
      }
      case 4: {
        return (
          this.roundHours(time.substring(0, 2)) +
          ":" +
          this.roundMinutes(time.substring(2, 4)) +
          " " +
          suffix
        );
      }
    }
  }

  roundHours(time: string): string {
    return parseInt(time) > 12 ? "12" : time;
  }

  roundMinutes(time: string): string {
    if (time.length === 1) {
      return parseInt(time) > 5 ? "5" : time;
    }
    return parseInt(time) > 59 ? "59" : time;
  }
}

export function getHoursMinutes(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const modMinutes = minutes % 60;
  return `${hours}h ${modMinutes}m`;
}

import { observer } from "mobx-react-lite";
import React from "react";
import "../../Css/styles.css";
import moment, { Moment } from "moment";
import DateRow from "./DateRow";

interface Props {
  date: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  displayMonth: any;
  month: string;
  year: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  reset: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  displayYear: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setMonth: any;
  day: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setDate: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  incrementMonth: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  decrementMonth: any;
}

function DateCalendar(Props: Props) {
  const check = moment(Props.date, "MM/DD/YYYY");

  const calendarHeaders = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
    (day) => {
      return (
        <th key={day} className="calendarHeader">
          {day}
        </th>
      );
    }
  );
  const month = moment(Props.month, "M").format("MMMM");
  const year = Props.year;
  const getNumberRows = (firstOfMonth: number, date: string): number => {
    const daysInRow1 = 7 - firstOfMonth;
    const daysLeftInMonth =
      moment(date, "MM/DD/YYYY").daysInMonth() - daysInRow1;
    return Math.ceil(daysLeftInMonth / 7 + 1);
  };

  function determineClass(
    arg: number,
    selectedNumber: number,
    selectedMonth: number,
    selectedYear: number,
    date: string
  ): string {
    const check = moment(date, "MM/DD/YYYY");
    if (arg === 0) {
      return "blankDate";
    }
    if (
      parseInt(check.format("YYYY")) === selectedYear &&
      parseInt(check.format("M")) === selectedMonth &&
      arg === selectedNumber
    ) {
      return "selectedDate";
    }
    return "date";
  }
  /* functions to set the months properly + year incase that is needed */

  // returns the index of [0-6] to return the first day of the week
  const getFirstOfMonth = (date?: string): number => {
    if (date) {
      return parseInt(moment(date, "MM/DD/YYYY").startOf("month").format("d"));
    }

    return parseInt(moment().startOf("month").format("d"));
  };
  const createRows = (date: Moment) => {
    /* Number of days after that are blank  */
    const firstOfMonth: number = getFirstOfMonth(date.format("MM/DD/YYYY"));
    const numRows: number = getNumberRows(
      firstOfMonth,
      date.format("MM/DD/YYYY")
    );
    const lastOfMonth: number = moment(date).daysInMonth();
    const rowArray = createRowArray(lastOfMonth, firstOfMonth, numRows);
    return rowArray;
  };

  function createRowArray(last: number, first: number, rows: number) {
    const lastOfMonth = last;
    const firstOfMonth = first;
    let startRow = 0;
    const DateRows = [];
    let tempRow = [];
    let firstPass = true;
    for (let i = 0; i < rows; i++) {
      tempRow = Array.from({ length: 7 }, (v, k) => {
        if (k + startRow < firstOfMonth) {
          if (firstPass) {
            return 0;
          }
        }
        if (k + startRow > lastOfMonth) {
          return 0;
        }
        if (k + startRow === firstOfMonth && firstPass) {
          return 1;
        }
        if (startRow === 0) {
          return k - firstOfMonth + 1;
        }
        return k + startRow;
      });
      DateRows.push(tempRow);
      startRow = tempRow[6] + 1;
      firstPass = false;
    }
    return DateRows;
  }
  /*
  moment().set('year', 2013);
  moment().set('month', 3);  / 
  */
  // conditional to check/change the month/days
  if (Props.month !== "") {
    check.set("month", parseInt(Props.month) - 1);
  }
  if (Props.year !== "") {
    check.set("year", parseInt(Props.year));
  }

  const RowArray = createRows(check);
  // have to match months too
  const rows = RowArray.map((row, index) => {
    return (
      <DateRow
        setDate={Props.setDate}
        date={Props.date}
        selectedYear={parseInt(Props.year)}
        selectedMonth={parseInt(Props.month)}
        selectedDay={parseInt(Props.day)}
        determineClass={determineClass}
        key={index}
        days={row}
      />
    );
  });

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "12px",
          marginTop: "5px",
          padding: "0 5px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <div
            onClick={Props.displayMonth}
            className="hoverCalendarButton"
            style={{ padding: ".25rem", fontSize: "16px", color: "black" }}
          >
            {month}
          </div>
          <div
            onClick={Props.displayYear}
            className="hoverCalendarButton"
            style={{ padding: ".25rem", fontSize: "16px", color: "black" }}
          >
            {year}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            paddingRight: "5px",
          }}
        >
          <button
            onClick={() => Props.decrementMonth()}
            className={["calendarButton", "card"].join(" ")}
          >
            &lt;
          </button>
          <button
            onClick={Props.reset}
            className={["calendarButton", "card"].join(" ")}
          >
            ↻
          </button>
          <button
            onClick={() => Props.incrementMonth()}
            className={["calendarButton", "card"].join(" ")}
          >
            &gt;
          </button>
        </div>
      </div>

      <table
        style={{
          borderCollapse: "collapse",
          tableLayout: "fixed",
          width: "300px",
        }}
      >
        {/*className="tableHeader"*/}
        <thead className="tableHeader">
          <tr>{calendarHeaders}</tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    </>
  );
}

export default observer(DateCalendar);

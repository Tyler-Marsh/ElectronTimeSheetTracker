import { observer } from "mobx-react-lite";
import React, { Dispatch, SetStateAction, useEffect, useRef } from "react";
import history from '../../Helpers/history'
import '../../Css/styles.css';
import moment from 'moment';

interface Props {
  date: string;
  show: boolean;
 // hide: Dispatch<SetStateAction<boolean>>;
  hide: React.Dispatch<React.SetStateAction<void>>;
  
}

// hold a verified date

interface State {
  input: string;
  showCalendar: boolean;
}

function Calendar(Props: Props) {

 const calendarHeaders  = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => {
    return <th key={day} className="calendarHeader">{day}</th>
  });

  const calendarRef: React.RefObject<HTMLDivElement> = useRef();

  useEffect(() => {
    document.addEventListener("mousedown",
    
    (event: any) => { 
        if (calendarRef.current && !calendarRef?.current.contains(event.target)) {
          Props.hide();
        }
    })

  })

  const getNumberRows = (firstOfMonth: number, date : string) : number => {

   // "MM/DD/YYYY"
    const year = date.split("/")[2];
    const month = date.split("/")[0];
    moment("YYYY/MM", year + "/" + month).daysInMonth
    moment("2013-10", "YYYY-MM").daysInMonth()
  
    const daysInRow1 = 7-firstOfMonth;
    const daysLeftInMonth =  moment("2013-10", "YYYY-MM").daysInMonth() -daysInRow1;
    return Math.ceil(daysLeftInMonth/7 + 1);

  }


  const getFirstOfMonth = (date?: string) : number => {

    if (date) {
      // "12-25-1995", "MM-DD-YYYY"
      return parseInt(moment(date, "MM/DD/YYYY").startOf("month").format("d"));
    } 
   // returns the first of the month day
   // moment().startOf("month").format("ddd")  "mon"?
   // number might be better because then we can iterate through them
     return parseInt(moment().startOf("month").format("d")); 
  }
  //  const  firstDayOfMonth = () => {
  // create a format for current date I want
  // add one day?
    const firstDay = moment(new Date()).format('MM/DD/yyyy')
    console.log(firstDay);

    console.log(Props)
    // .startOf("month")
    // .format("d"); 
    // console.log(dateObject)
    //     dateObject.
    //     let firstDay = moment(dateObject)
    //                  .startOf("month")
    //                  .format("d"); 
    //    return firstDay;
    // };

  if (Props.show === false) {
    return (<div></div>)
  }

  const getCalendarRows = () => {
    const firstOfMonth = getFirstOfMonth(Props.date);
    const numberOfRows = getNumberRows(firstOfMonth, Props.date);

  }
  

  console.log("RIGHT BEFORE RENDER")

  //
    return (
      <>
        <div ref={calendarRef} className="card" style={{position: "absolute", zIndex: 5, backgroundColor: "#FFF", border: "1px solid E8E8E8"}}>
          <div style={{display: "flex", justifyContent:"space-between", marginBottom: "12px", marginTop: "5px", padding: "0 5px"}}>
            <div style={{display: "flex", paddingTop: "5px"}}>
              <div style={{margin: "0rem .5rem", fontSize: "16px"}}>
                Month
              </div>
              <div style={{margin: "0rem .5rem", fontSize: "16px"}}>
              Year
              </div>
            </div>
            <div style={{display: "flex", justifyContent:"space-between", paddingRight: "5px"}}> 
                <button className={["calendarButton", "card"].join(" ")}>
                  &lt;
                </button>
                <button className={["calendarButton", "card"].join(" ")}>
                ↻
                </button>
                <button className={["calendarButton", "card"].join(" ")}>
                &gt;
                </button>
            </div> 
          </div>
         
          <table style={{borderCollapse: "collapse"}}>  
            <thead className="tableHeader">
              <tr> 
                {calendarHeaders}
              </tr>  
            </thead>
            <tbody>
              <tr>
                <td>
                  hi
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </>
    );
}

/*
let weekdayshortname = this.weekdayshort.map(day => {
   return (
     <th key={day} className="week-day">
      {day}
     </th>
   );
});
*/
export default observer(Calendar)
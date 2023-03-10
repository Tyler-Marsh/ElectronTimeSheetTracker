import React, {useEffect, useRef} from "react";
import '../../Css/styles.css';
import DateCalendar from './DateCalendar';
import Months from './Months';
import Years from './Years';


interface State {
  showMonth: boolean;
  showYear: boolean;
  showDate: boolean;
  year: string;
  month: string;
  date: string;
}

interface Props {
  hide: React.Dispatch<React.SetStateAction<void>>;
  show: boolean;
  showMonth: boolean;
  showYear: boolean;
  showDate: boolean;
  year: string;
  month: string;
  date: string;
  day: string;
  setMonth: any;
  setYear: any;
  displayMonth: any;
  reset: any;
  displayYear: any;
  inputValid: boolean;
  setDate: any;
  incrementMonth: any;
  decrementMonth: any;
}


function CalendarContainer(Props: Props) {
  
  const calendarRef: React.RefObject<HTMLDivElement> = useRef();

  useEffect(() => {
    document.addEventListener("mousedown", 
    (event: any) => { 
        if (calendarRef.current && !calendarRef?.current.contains(event.target)) {
          Props.hide();
        }
    })
  })
  
  if (Props.show === false) {
    return (<div></div>)
  }

  return (
    <div ref={calendarRef} className="card" style={{padding: "5px",position: "absolute", zIndex: 5, backgroundColor: "#FFF", border: "1px solid E8E8E8"}}>
      {
        Props.showDate &&
        <DateCalendar decrementMonth={Props.decrementMonth} incrementMonth={Props.incrementMonth}  setDate={Props.setDate} day={Props.day} setMonth={Props.setMonth}  displayYear={Props.displayYear} reset={Props.reset} year={Props.year} month={Props.month} date={Props.date} displayMonth={Props.displayMonth} />
      }

      {
        Props.showMonth &&
          <Months  showYear={Props.displayYear} date={Props.date} year={Props.year} setMonth={Props.setMonth} />
      }
      {
        Props.showYear &&
        <Years reset={Props.reset} year={Props.year} date={Props.date} tempYear={Props.year} setYear={Props.setYear} />
      }
    </div>
  )
}

export default CalendarContainer;
import React from 'react';
import { observer } from 'mobx-react-lite';


interface Props {
  days: Array<number>;
  determineClass(arg: number, selectedDay:number, selectedMonth: number, selectedYear: number, date: string): string;
  selectedDay: number;
  selectedMonth: number;
  date: string;
  selectedYear: number;
  setDate: any;
}

function DateRow(Props : Props) : JSX.Element {
  
  const days = Props.days.map((day, index) => {
   return(
      <td onClick={() => {if (day ===0 ){return} Props.setDate(day)}}  key={index} className={Props.determineClass(day, Props.selectedDay, Props.selectedMonth, Props.selectedYear, Props.date)}>
        {day === 0 ?  "" : day}
      </td>
   )
  })
  return (
    <tr>
      {days}
    </tr>
  )
}

export default observer(DateRow);
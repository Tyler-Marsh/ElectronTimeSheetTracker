import React from 'react';
import moment from 'moment';
interface Props {
  year: string;
  setMonth: any;
  date: string;
  showYear: any;
}

function Months(Props: Props) {

  const months = ["Jan","Feb","Mar","Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];

  const monthCards = months.map((month, index) =>
  <div key={month} onClick={() => {Props.setMonth(index + 1)}} className={["month", "card"].join(" ")}>
    {month}
  </div>
);


const check = moment(Props.date, 'MM/DD/YYYY');
const year =  Props.year === '' ?   check.format('YYYY') : Props.year;

  return (
   <div>
     <div style={{display: "flex", justifyContent:"space-between", marginTop: "5px", padding: "0 5px"}}>
            <div style={{display: "flex", justifyContent:"space-between", alignItems: "flex-end"}}> 
              <div onClick={() => {Props.showYear()}} className="hoverCalendarButton" style={{padding: ".25rem", fontSize: "16px", color: "black"}}>
              {year}
              </div>
            </div>
            <div style={{display: "flex", justifyContent:"space-between", paddingRight: "5px"}}> 
                <button className={["deactivatedCalendarButton", "card"].join(" ")}>
                  &lt;
                </button>
                <button className={["deactivatedCalendarButton", "card"].join(" ")}>
                ↻
                </button>
                <button className={["deactivatedCalendarButton", "card"].join(" ")}>
                &gt;
                </button>
            </div> 
          </div>
    <div className="monthGrid" style={{marginLeft: ".25rem", marginRight: ".25rem"}}>
      {monthCards}
    </div>
    <div style={{marginTop: ".25rem"}}>

    </div>
  </div> 
  )
}

export default Months;
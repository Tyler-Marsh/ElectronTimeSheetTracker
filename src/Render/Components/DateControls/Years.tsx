import React, {useState} from 'react';
import moment from 'moment';

interface Props {
  reset: any;
  date: string;
  tempYear: string;
  setYear: any;
  year: string;

}

interface State {
  tempStartYear: number;
}

function Years(Props: Props) {
  
  const check = moment(Props.date, 'MM/DD/YYYY');
  const currentYear = check.format('YYYY');

  const [tempStartYear, setState] = useState(parseInt(currentYear));

  const decrementTempStartYear = (year: number) : void => {
    setState(year -10);
  }

  const incrementTempStartYear = (year: number) : void => {
    setState(year + 10);
  }

  const range = (start :number, end: number) => Array.from({length: (end +1  - start)}, (v, k) => k + start);

  const theYears = range(tempStartYear -1, tempStartYear + 10);

  const yearCards = theYears.map((year : number, index : number) => 
    <div key={index} onClick={() => {Props.setYear(year)}} className={["month", "card"].join(" ")}>
      {year}
      </div>
  )

  return (
    <div>
    <div style={{display: "flex", justifyContent:"space-between", marginTop: "5px", padding: "0 5px"}}>
           <div style={{display: "flex", justifyContent:"space-between", alignItems: "flex-end"}}> 
             <div   style={{padding: ".25rem", fontSize: "16px", color: "black"}}>
              {(tempStartYear-1) + "  -  "  + (tempStartYear + 10)}
             </div>
           </div>       
           <div style={{display: "flex", justifyContent:"space-between", paddingRight: "5px"}}> 
                <button  onClick={() => {decrementTempStartYear(tempStartYear)}} className={["calendarButton", "card"].join(" ")}>
                  &lt;
                </button>
                <button onClick={Props.reset} className={["calendarButton", "card"].join(" ")}>
                ↻
                </button>
                <button onClick={() => {incrementTempStartYear(tempStartYear)}} className={["calendarButton", "card"].join(" ")}>
                &gt;
                </button>
            </div> 
         </div>
   <div className="monthGrid" style={{marginLeft: ".25rem", marginRight: ".25rem"}}>
   { yearCards}
   </div>
   <div style={{marginTop: ".25rem"}}>
   
   </div>
 </div> 
  )
}

export default Years;
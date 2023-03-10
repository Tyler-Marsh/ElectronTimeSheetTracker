import { observer } from 'mobx-react-lite';
import React, { useReducer, useContext} from 'react';
import moment from 'moment';
import CalendarContainer from './CalendarContainer';
import { RootStoreContext } from '../../Stores/RootStore';


interface State {
  input: string;
  showCalendar: boolean;
  showDate: true;
  showYear: false;
  showMonth: false;
  year: string;
  month: string;
  date: string;
}

interface Props {
  mobxSetDate: any;
  offset: boolean;
  defaultDate?: string;
}

function reducer(state: State, action: {type : string, input: string, year: string, date: string, month: string }) {
	const { type, year, date, month, input } = action;
  const check = moment();
	switch(type) {
    case 'show-calendar':
      return {...state, showCalendar: true};
    case 'hide-calendar':
      // year: check.format("YYYY"), month: check.format("M"), date: check.format("D")
      return {...state, showCalendar: false, showMonth: false, showDate: true, showYear: false};
    case 'change-month':
      return {...state, year: year, month: month}
		case 'show-month': 
			return {...state, showMonth: true, showDate: false, showYear: false};
		case 'show-year':
			return {...state, showMonth: false, showDate: false, showYear: true};	
		case 'show-date':
			return {...state, showMonth: false, showDate: true, showYear: false};
    case 'set-month':
      return {...state, month: month, showMonth: false, showDate: true, showYear: false};
    case 'set-year':
      return {...state, year: year, showDate: true, showYear: false, showMonth: false};
      // set-date should close the calendar and set the date in the calendar component not just the container
    case 'set-date': 
      return {...state, showDate: true, showCalendar: false, input: input, showMonth: false, showYear: false, date: date};
      // try setting this based on settings state
    case 'set-full-input':
      return {...state, input: input, year: year, date: date, month: month};
    case 'reset':
      return {showDate: true, showCalendar: true, input: '', showMonth: false, showYear: false, year: check.format("YYYY"), date:"",month: check.format("M")}
		default:
			return {...state}
	}
}

function DateControl(Props: Props) {

  let defaultDate = '';
  if (Props.defaultDate && Props.defaultDate !== 'Default') {
    defaultDate = Props.defaultDate
  }
  const check = moment();
  const aState: State = {input: defaultDate, showCalendar: false, showDate: true, showYear: false, showMonth: false, year: check.format("YYYY"), month: check.format("MM"), date: "" }
  const [state, dispatch] = useReducer(reducer, aState);

  const numbers = ["0","1","2","3","4","5","6","7","8","9", ""];
 
 const handleClick = (event:  React.MouseEvent<HTMLButtonElement>) => {
  event.preventDefault();
  dispatch({type: 'show-calendar', year:'',date:'',month:'', input:''});
};

const closeMenu = () => {
  dispatch({type:'hide-calendar',year:'',date:'',month:'', input:''});
}

/*Needs to go to MobX */
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) : void => {

    const value = event.target.value
    let broke = false;  
    // 09/092
    const areNumbers = value.replace(/\//g, "");
    for (let i = 0; i < areNumbers.length; i++) {
      if (numbers.indexOf(areNumbers[i]) === -1 ) {
        return;
      }
    }
    switch(value.length) {
      case 1: {
        if (value.length > state.input.length) {
          if (parseInt(value) > 1) {
           
            const newValue = "0"+value;
            dispatch({...state, type:'set-date',input: newValue})
            Props.mobxSetDate(newValue);
          }
          if (parseInt(value) === 1 || parseInt(value) === 0) {
            dispatch({...state,type:'set-date', input: value});
          } 
        }

        if (value.length < state.input.length) {    
          dispatch({...state, type:'set-date', input: ""})
          Props.mobxSetDate("");
        }
        broke = true;
        break;
      }
      case 3 : {     
        const newValue = handleSlashes(value, state.input);
        Props.mobxSetDate(newValue);
        dispatch({...state, type:'set-date',input: newValue}); 
        broke = true;
        break;
      } 
      case 6: {
        const newValue = handleSlashes(value, state.input);
        Props.mobxSetDate(newValue);
        dispatch({...state, type:'set-date', input: newValue}); 
        broke = true;
        break;
      }
      case 9 : {
        if (value.length < state.input.length) {
          const check = moment();
          Props.mobxSetDate(value);
          dispatch({...state, type: 'set-full-input', input: value, month: check.format("M"), year: check.format("YYYY"), date: check.format("D") });
          broke = true;
          break;
        }
        break;
      }
      case 10: {
         if (validateDate(value)) {
           const check = moment(value, "MM/DD/YYYY")
           Props.mobxSetDate(value);
           dispatch({...state, type:'set-full-input', input: value, month: check.format("M"), date: check.format("D"), year: check.format("YYYY")});
           broke = true;
         }
        break;
      }
      case 11: {
        broke = true;
        break;
      }
    }
    if (broke) {
      return;
    }
    Props.mobxSetDate(event.target.value);
    dispatch({...state, type:'set-date',input: event.target.value});
    return;
  }

  const handleSlashes = (value: string, stateValue: string ) : string =>  {
    // str.substring(str.length - 1)
    // can handle for  D being greater than 3

    if (parseInt(value.substring(value.length -1)) > 3 && value.length <= 4 ) {
      return stateValue + "/" + "0" + value.substring(value.length -1);
    }

    if (value.length > stateValue.length ) {
      return stateValue + "/" + value.substring(value.length -1)
    }
    return stateValue.substring(0, stateValue.length -2);
  }

  const interpretDate = (value: string) : boolean => {
    
    if (value.length < 10) {
      return false;
    }
    if (value.length === 10) {
      try {
        if (parseInt(value.split("/")[2]) > 2015 && parseInt(value.split("/")[2])) {
          return moment(value, "MM/DD/YYYY").isValid();
        }
      } catch(ex) {
      return false;
      }
    }
  }

	const displayMonth = () => {
		dispatch({...state, type: "show-month"});
	}

  const showYear = () => {
    dispatch({...state, type:"show-year"});
  }

  const setYear = (year: string) : void => {
    dispatch({...state, type: 'set-year', year: year})
  }

  const setMonth = (month: number) : void  => {
    const newMonth: string = month < 10 ?  "0" + month.toString() : month.toString();
    dispatch({...state, type: 'set-month', month: newMonth });
  }

  //moment(state.input, "MM/DD/YYYY").isValid()
  const validateDate = (value : string) : boolean => {
    return moment(value, "MM/DD/YYYY").isValid() && value.length === 10;
  }

  const validDate = () : boolean => {
    return moment(state.input, "MM/DD/YYYY").isValid() && state.input.length === 10;
  }

  const handleReset = () : void => {
    dispatch({...state, type:'reset'})
  }

  /* SWITCH TO MOBX STATE MANAGEMENT */
 const setDate = (value: number) : void => {
   let dateValue = value.toString();
   if (value <= 9) {
    dateValue = "0" + dateValue;
   }
   const month = state.month.toString().length === 1 ? "0" + state.month : state.month;
   const input =  month + "/" + dateValue + "/" + state.year;
  dispatch({...state, type: 'set-date', date: dateValue, input: input});
  Props.mobxSetDate(input);
 }

 const incrementMonth = () : void => {
   let month = parseInt(state.month);
   if (month === 12) {
     const year = (parseInt(state.year) + 1).toString();
     dispatch({...state,type:'change-month', year: year, month: "01"});
     return;
   }
   month++;
   dispatch({...state, type: 'change-month', month: month.toString()});
   return;
 }

 const decrementMonth = () : void => {
   let month = parseInt(state.month);
   if (month === 1) {
     const year = (parseInt(state.year) -1).toString();
     dispatch({...state, type:'change-month', year: year, month: "12"});
     return;
   }
   month--;
   dispatch({...state, type: 'change-month', month:  month.toString()})
   return;
 }
    
  return (
    <div style={{ position: "relative", left: 0, right: 0, top: 0, bottom: 0, marginLeft: Props.offset === true ? "1rem" :"0rem", justifyContent:"start", display: "flex", alignItems: "start"}}>
        <CalendarContainer incrementMonth={incrementMonth}   decrementMonth={decrementMonth}  setDate={setDate} day={state.date}  inputValid={validDate()} setYear={setYear} displayYear={showYear} reset={handleReset} displayMonth={displayMonth} setMonth={setMonth} year={state.year} month={state.month} showYear={state.showYear} showMonth={state.showMonth} showDate={state.showDate}  show={state.showCalendar} hide={closeMenu}  date={ validDate() ? state.input : moment().format("MM/DD/YYYY").toString()} />
        <div style={{width:"5rem", display:"flex", justifyContent:"space-between", alignItems:"start"}}>
            <input value={state.input}  onChange={handleChange} placeholder="mm/dd/yyyy" className="dateInput" style={{height: "1.5rem"}} id="1firstInput" type="text">                  
            </input>
            <button onClick={handleClick} style={{padding: "2px", marginLeft: "5px",justifyContent: "center",display:  "flex", alignItems: "center", height: "1.5rem"}}>
                <p style={{paddingBottom: "3px", fontSize: "20px"}}>&#128197;</p>
            </button>     
        </div>
    </div>
  )

}

export default observer(DateControl)
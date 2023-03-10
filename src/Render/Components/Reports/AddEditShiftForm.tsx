import React, {useState, useContext} from 'react';
import DateControl from '../DateControls/DateControl'
import TimeInput from './TimeInput';
import {getHoursMinutes, TimeParser} from '../../../Main/Helpers/Helpers'
import DbSingleResult from '../../Models/DbSingleResult';
import { apiDefineProperty } from 'mobx/dist/internal';
import { RootStoreContext } from '../../Stores/RootStore';
import {ShiftModel} from '../../Models/ShiftModel';
import moment from 'moment';
import { monitorEventLoopDelay } from 'perf_hooks';
import { stringify } from 'querystring';
import { setUncaughtExceptionCaptureCallback } from 'process';


interface Props {
  type: "edit" | "add";
  title: string;
  submit: any;
  date: string;
  shiftId: string;
  in: string;
  out:string;
  extra: string;
  comments: string;
  close: any;
  employeeId: number;
  BreakTime: number;
}

interface State {
  date: string;
  in: string;
  out: string;
  extra: string;
  comments: string;
  // first == Add | Edit second == DB Validation step
  // button to switch the steps
  breakHours: string;
  breakMinutes: string;
  apiMessage: string;
  step: string;
  [key: string]: string
}

function AddEditShiftForm(Props: Props) {


  const getdefaultBreakMinutes = () => {
    const breakTime = Props.BreakTime;
    if (isNaN(breakTime)) {
      return 0;
    }
    return breakTime%60;
  }

  const getdefaultBreakHours = () => {
    const BreakTime = Props.BreakTime;

    if (isNaN(BreakTime)) {
      return 0;
    }
    return Math.floor(BreakTime/60);
  }


  const breakTimeFromDB = () => {
    const totalBreakTime = Props.BreakTime
    if (!isNaN(totalBreakTime)) {
      const startHours:number = Math.floor(totalBreakTime/60);
      const startMinutes:number = totalBreakTime % 60;
      return {startHours, startMinutes};
    }
    return {startHours:0, startMinutes: 0}
  }

  // EXTRA STATE FOR WHAT STEP THE FORM IS IN
  const {employeeStore, settingsStore} = useContext(RootStoreContext);

  const {startHours, startMinutes} = breakTimeFromDB();


 const [state, setState] = useState<{[key: string]: string}>(
  {date: Props.date, in: Props.in, out: Props.out, extra: Props.extra, comments: Props.comments, step:"first", apiMessage: "", breakHours: startHours.toString(), breakMinutes: startMinutes.toString()}
 )



 const getBreakTime = () : number => {

  getdefaultBreakMinutes();
  return parseInt(state.breakHours)*60  + parseInt(state.breakMinutes);
}

const hasNonDigits = (value: string) : boolean => {
  // ignore :
  return /[^:]{1}\D+/g.test(value);
}

const isLetter = (value :string) : boolean => {
  return /[A-Za-z]/g.test(value);
}

const AMorPM = (value: string) : string => {
  
  const letter = value[6];
  if (['qweasdzxcrfvtgb'].includes(letter)) {
    return 'am';
  }
  return 'pm';
}


  const PlusMinusMin = (InOrOut: string, sign: string, minute: string, indexPlace: number) => {

    let newMinutes = sign === 'plus' ? parseInt(minute) +1 : parseInt(minute) -1;
    let newTime ='';
    if (newMinutes === 6 && sign === 'plus' && indexPlace === 3) {
     newMinutes = 0;
    }
    if (newMinutes === -1 && sign === 'minus' && indexPlace === 3) {
      newMinutes = 5;
     }
    if (newMinutes === 10 && sign === 'plus' && indexPlace === 4) {
    newMinutes = 0;
    }
    if (newMinutes === -1 && sign === 'minus' && indexPlace === 4) {
      newMinutes = 9;
     }

    newTime = state[InOrOut].substring(0,indexPlace) + newMinutes.toString() + state[InOrOut].substring(indexPlace+1,8)
    setState({
    ...state, [InOrOut]: newTime
    })

  }

  const PlusMinusHours = (InOrOut: string, sign: string, hour: string) => {

    let newHour;
    let changeSuffix = false;
    let newSuffix ="";
    const oldSuffix = state[InOrOut].substring(6,8);
    if (sign === "minus") {
     newHour = parseInt(hour) -1
    }
    if (sign === "plus") {
      newHour = parseInt(hour) + 1;
    }
    if (newHour >= 13) {
      newHour = 1;
    }
    if (newHour <= 0) {
      newHour = 12
    }
    if (newHour === 12 && sign === 'plus') {
      changeSuffix = true;
      newSuffix = oldSuffix === 'am' ? 'pm' : 'am'
    }
    if (newHour === 11 && sign === 'minus') {
      changeSuffix = true;
      newSuffix = oldSuffix === 'am' ? 'pm' : 'am'
    }
  
    newHour = newHour.toString().length === 1 ? "0"+newHour.toString() : newHour.toString();
    let finalHour =  newHour + state[InOrOut].substring(2,8)
    if (changeSuffix) {
      newSuffix = state[InOrOut].substring(6,8) === 'am' ? 'pm' : 'am';
      finalHour = newHour + state.in.substring(2,6)  + newSuffix;
    }
   
    setState({
      ...state, [InOrOut]: finalHour
    });
  }

  const toggleAMPM = (InOrOut: string) => {
  
    const s = state[InOrOut];
    const currentAMPM = state[InOrOut].substring(s.length -2,s.length);

    let AMPM = ''
    switch(currentAMPM) {
      case 'pm': {
        AMPM = 'am'
        break;
      }
      case 'am': {
        AMPM = 'pm'
        break;
      }
      default: {
        AMPM = InOrOut === 'in' ? 'am' : 'pm'
      }
    }
    const finalTime = s.substring(0,6) + AMPM;

    setState({
      ...state, [InOrOut]: finalTime
    });
  }

  const timeInputChange = (InOrOut: string, indexPlace: number, e: React.ChangeEvent<HTMLInputElement>) => {

    const value = e.target.value;
    
    if (Number.isNaN(parseInt(value))) {
     return;
    }

    if (indexPlace === 1) {
      if (parseInt(value)===1) {
        // put in one then a space and if the current value is equal
        // to one then correct it else make it 12 because thats the maximum
        const newvalue = "1 "+state[InOrOut].substring(2,8);
        setState({
          ...state, [InOrOut] : newvalue
        })
        return;
      }

      
      let newValue = parseInt(value) > 12 ? 12 : value;
      newValue = parseInt(value) < 0 ? 0 : newValue;
      if (newValue.toString().length === 1) {
        newValue = '0'+ newValue.toString();
      }
      newValue = newValue + state[InOrOut].substring(2,8);
      setState({
        ...state, [InOrOut] : newValue
      });
      return;
    }

    if (indexPlace === 3) {
      let newValue = parseInt(value) > 5 ? 5 : value;
      newValue = newValue < 0 ? 0 : newValue;
     
      newValue = state[InOrOut].substring(0,3) + newValue.toString() + state[InOrOut].substring(4,8);
      setState({
        ...state, [InOrOut] : newValue
      });
      return;
    }

      const newValue = state[InOrOut].substring(0,4) + value.toString() + state[InOrOut].substring(5,8);
      setState({
        ...state, [InOrOut]: newValue
      });
    
  }

  function handleChange(e: any) {
    const name : string = e.target.getAttribute('name');
    const value : string = e.target.value;

    console.log("THE VALUE: " +value);


    if (name.toLocaleLowerCase() === "in" || name.toLocaleLowerCase() === "out") {
      const numbers = ["0","1","2","3","4","5","6","7","8","9", ""];
      const areNumbers = value.replace(/\//g, "");
      for (let i = 0; i < areNumbers.length; i++) {
        if (numbers.indexOf(areNumbers[i]) === -1 ) {
          return;
        }
      
      setState({
        ...state,
        [name]: value
      });
    }

      setState({
        ...state,
        [name]: value
      });
    }
  }

  const setDate = (date : "string") => {
    setState({...state, date});
  }

  const setComments = (e: any) => {
    setState({
      ...state, comments: e.target.value
    })
  }

  // blur?

  // shouldn't there be a time validation function that can just see what it is going to be???
  const blurValidateTime = (InOrOut: string, time: string, AMorPM: string) => {

    const parser = new TimeParser();
    let parsedTime = parser.parse(time);
    const defaultTime = InOrOut === 'in' ? '08' : '05';
    parsedTime = parseInt(parsedTime.substring(0,2)) !== 0 ? parsedTime : defaultTime + parsedTime.substring(2,8)

    let defaultedTime ='';
    if (parsedTime === '') {
     
      defaultedTime = defaultTime+ ':00 ' + AMorPM.toLocaleLowerCase();
     
      setState({...state, [InOrOut]: defaultedTime})
      return;
    }
    if (parsedTime.length === 5) {
      parsedTime += " " + AMorPM;
    }
    if (parsedTime.length === 6) {
      parsedTime += AMorPM;
    }
    if (!parsedTime.search('a') || !parsedTime.search('p')) {
      parsedTime += " " + AMorPM
    }

    setState({...state, [InOrOut]: parsedTime})
  }

  const handleClose = () => {
    Props.close();
  }

  const submit =  async () => {


    // new date checking function to reuse
    const extraNum: number = parseInt(state.extra);

    console.log( "\n \n \n Extra Number: "+extraNum)
    const theExtra: number = Number.isNaN(extraNum) === true ? 0 : extraNum;
   // const theExtra: number = state.extra === '' ? 0 : parseInt(state.extra)
    let inDateTime = moment(state.date + " "+state.in, 'MM/DD/YYYY H:mm:ss a').format('YYYY-MM-DD HH:mm:ss')
    inDateTime +='.000';

    let outDateTime = moment(state.date + " "+state.out, 'MM/DD/YYYY H:mm:ss a').format('YYYY-MM-DD HH:mm:ss')
    outDateTime +='.000';

    if (moment(outDateTime).diff(moment(inDateTime), 'minutes') < 0) {
     outDateTime =  moment(outDateTime, 'YYYY-MM-DD HH:mm:ss').add(1, 'days').format('YYYY-MM-DD HH:mm:ss');
     
    }

    let breakTime = getBreakTime();

    if (isNaN(breakTime)) {
      breakTime = 0;
    }

   const shift: ShiftModel = {Comments: state.comments, pk_ShiftId: parseInt(Props.shiftId), Start: inDateTime, End: outDateTime, fk_EmployeeId: Props.employeeId, Extra: theExtra, BreakTime:breakTime}

   const result: DbSingleResult = await Props.submit(shift);
  
     
   setState({
      ...state, step: 'second', apiMessage: result.message
    });
   
  }


if (state.step === 'second') {
  return (
    <>
     <p style={{textAlign: "center", marginTop: "0rem", borderBottom: "1px solid gainsboro"}}>{Props.title}</p>
                  <div style={{height: "2rem", margin: "0px auto", width: "50%"}}>
                    {state.apiMessage}
                  </div>
                  <div style={{display: "flex", justifyContent:"center"}}>
                    <button onClick={() => {handleClose()}}>
                     Ok
                    </button>
                  </div>
    </>
  )
}


let maxBreakHours = 0;
try {
  const newMom = moment().format('MM/DD/YYYY');
  const newStart = moment(newMom+ " " + state.in, 'MM/DD/YYYY HH:mm A').format('MM/DD/YYYY HH:mm A');
  const newEnd = moment(newMom+ " "+ state.out, 'MM/DD/YYYY HH:mm A')

  // INSERT SETTINGS HERE.
  // GET SETTING UPON START UP

  // MAKE JSON SETTINGS FILE NEAR THE DB?

  const diff = newEnd.diff(newStart, 'minutes')
  maxBreakHours = Math.floor(newEnd.diff(newStart, 'minutes')/60)

  maxBreakHours = maxBreakHours > 1 ? maxBreakHours -1 : 0;
}
catch(err) {
  
}

const setExtra =(e:React.ChangeEvent<HTMLInputElement>) => {
  setState({...state, extra: e.target.value});
}

console.log("IN TIME: " + state.in);

 return (
   <>
    <p style={{textAlign: "center", marginTop: "0rem", borderBottom: "1px solid gainsboro"}}>{Props.title}</p>
                  <div style={{height: "2rem", margin: "0px auto", width: "50%"}}></div>
                     <div className="formGrid">
                       <div>
                         <p>Date</p>
                         <div>
                           <DateControl defaultDate={Props.date} offset={false} mobxSetDate={setDate} />
                         </div>
                       </div>

                       <div>
                         <p>
                           Extra Hours
                         </p>
                         <div className="flexFormItem">
                           <input value={state.extra} onChange={(e)=> {setExtra(e)}}  max="16" min="0" type="number" className="timeInput"></input>
                         </div>
                       </div>

                      <TimeInput toggleAMPM={toggleAMPM} timeInputChange={timeInputChange} PlusMinusMin={PlusMinusMin} PlusMinusHours={PlusMinusHours} InOrOut={"in"} change={handleChange} blurValidateTime={blurValidateTime} time={state.in} />

                      <TimeInput toggleAMPM={toggleAMPM} timeInputChange={timeInputChange} PlusMinusMin={PlusMinusMin} PlusMinusHours={PlusMinusHours} InOrOut={"out"} change={handleChange} blurValidateTime={blurValidateTime} time={state.out} />
                      
                    <div>
                      <label style={{paddingBottom: ".5rem"}}>Unpaid Breaktime</label>
                      <div style={{display:"flex", justifyContent:"space-between"}}>
                        <div style={{display:'flex', flexDirection:"column"}}>
                          <label style={{fontSize:".9rem", color: "#606060"}}>
                            Hours
                          </label>
                          {/* SETTINGS STORE FOR THIS */}
                          <input defaultValue={getdefaultBreakHours()} onChange={(e) => {setState({...state,breakHours: e.target.value})}} type="number" max={maxBreakHours} min={0} name="breakHours" id="breakHours">

                          </input>
                        </div>
                        <div style={{display:'flex', flexDirection:"column"}}>
                          <label style={{fontSize:".9rem" ,color: "#606060"}}>
                            Minutes
                          </label>
                          <input defaultValue={getdefaultBreakMinutes()} onChange={(e) => {setState({...state,breakMinutes: e.target.value})}}  max="59" min="0" type="number" name="breakMinutes" id="breakMinutes">

                          </input>
                        </div>
                        <div>

                        </div>
                      </div>
                    </div>
                    <div style={{gridColumn: "1/3"}}>
                      <p style={{textAlign:"left"}}>Comments</p>
                      <textarea value={state.comments} onChange={(e) => {setComments(e)}} rows={4} style={{width: "100%"}}>
                      </textarea> 
                    </div>
                     </div>

                  <div className="formGroup" style={{textAlign: "center", marginTop: "1rem"}}>
                      <button onClick={() => {submit()}}>Submit</button>
                  </div>
  </>
 )
}
export default AddEditShiftForm
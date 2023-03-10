import React, {useEffect, useState, useContext} from 'react';
import moment from 'moment';
import { ApiResult } from '../../Models/ApiResult'
import { ShiftModel } from '../../Models/ShiftModel'
import { RootStoreContext } from '../../Stores/RootStore';
import { Result } from '../../Models/Result';
import { getDateRange } from '../Reports/ReportHelpers';
import {SummaryShift, SummaryObject} from '../../Models/SummaryShift';
import SummaryRows from './SummaryRows';
import LoadingWheel from '../Loading/Loadingwheel';
import DbResult from '../../Models/DbResult';
import {roundingFun} from '../../Helpers/rounding'

interface State {
  loading: boolean;
  SummaryObject: SummaryObject;
  downloadMessage: string;
}


function SummaryTable():JSX.Element {

  const {settingsStore} = useContext(RootStoreContext);

  async function loadDates(): Promise<Result<moment.Moment[]>> { 
    return new Promise((resolve, reject) => {
        setTimeout(() => {
           const aRange : Result<moment.Moment[]> = getDateRange(settingsStore.StartDate, settingsStore.EndDate);
           resolve(aRange)
        }, 250)
    })
  }

  const aState: State = {loading: false, SummaryObject: {}, downloadMessage: ''}
  const [state, setState] = useState(aState);

  

  function setCutOffDate(date: string) {
    const desiredWeekday = 0
    const currentMoment = moment(date, 'YYYY-MM-DD hh:mm:ss.sss');
    const currentWeekday =currentMoment.isoWeekday()
    let missingDays = ((desiredWeekday - currentWeekday) + 7) % 7;
    //console.log("# missing days "+ missingDays)
    if (missingDays === 0) {
      missingDays += 7;
    }
    const endPayDate = currentMoment.add(missingDays, 'days');
    // not working on the sunday...

    // if it is sunday have to sad seven
    return endPayDate.format('YYYY-MM-DD hh:mm:ss.sss')
  }

  function isBetween(cutoffDate:string, date: string) {
    const cutOffDate1 = moment(cutoffDate);
    const cutOffClone = cutOffDate1.clone();
    const date1 = moment(date);
    const ISBETWEEN = date1.isBetween(cutOffClone.subtract(7, 'days'), cutOffDate1, 'days', '[]')
    return ISBETWEEN;
  }

  async function downloadSummary(summaryObject: SummaryObject, type: string, start: string, end: string) {
   setState({...state, loading: true})
   const result: DbResult = await  window.e_Summary.DownloadSummary(state.SummaryObject, 'csv', settingsStore.StartDate, settingsStore.EndDate)
   
   if (result.message.toLowerCase().includes('cancel')) {
    setState({...state, loading: false, downloadMessage: ''});
    return;
   }

   setState({...state, loading: false, downloadMessage: result.message})
   setTimeout(() => setState({...state, downloadMessage:'', loading: false}), 3000);
  }
  
  useEffect(() => {
    let mounted = true;
 
        const startDate = settingsStore.StartDate;
        const endDate = settingsStore.EndDate;

       if (startDate?.length !== 10 || endDate?.length !== 10 || !moment(startDate, 'MM/DD/YYYY').isValid || 
            !moment(endDate, 'MM/DD/YYYY').isValid || moment(endDate).diff(moment(startDate), 'days') < 0
       )
       {
            return;
       }
       /* ASYNC FETCH */

       // find out what the default departmentId is 
       const fetchData = async (startDate:string, endDate:string) => {

        setState({...state, loading:true});
        const newStartDate = moment(startDate, 'MM/DD/YYYY').set({hour:0,minute:0,second:0}).format('YYYY-MM-DD HH:mm:ss');
        const newEndDate = moment(endDate, 'MM/DD/YYYY').set({hour:23,minute:59,second:59}).format('YYYY-MM-DD HH:mm:ss');
        const departmentId = settingsStore.SelectedDepartmentId;
        const department = settingsStore.SelectedDepartment;
        const result: ApiResult<SummaryShift[]> = await window.e_Shift.GetSummaryShifts(settingsStore.SelectedDb, newStartDate, newEndDate,department, departmentId);
       

        if (result.isSuccess) {

          if (result.value.length === 0) {
            console.log("\n \n] LOADING === false ")
            setState({...state, loading: false, SummaryObject: {}})
            return;
          }
          const shifts = result.value;
          shifts[0].pk_EmployeeId

          const SummaryObject: SummaryObject = {}

          SummaryObject[shifts[0].pk_EmployeeId] = {
            Name:shifts[0].Name,
            pk_EmployeeId: shifts[0].pk_EmployeeId,
            Total: 0,
            RegHours: 0,
            Minutes: 0,
            OvertimeInMinutes: 0
          }

          let breakTime = 0;
          let shiftLengthMinutes =0;
          let overtimeCount = 0;
          let currentPersonId = shifts[0].pk_EmployeeId

          let paydayCutOff = setCutOffDate(shifts[0].Start)

          for (let shiftIndex = 0; shiftIndex < shifts.length; shiftIndex++) {

            // switch current person building stats for
            if (shifts[shiftIndex].pk_EmployeeId !== currentPersonId) {

              //clean up last person by setting their overtime???
              SummaryObject[currentPersonId].OvertimeInMinutes += overtimeCount > 2400 ? overtimeCount - 2400: 0;
              /* */

              currentPersonId = shifts[shiftIndex].pk_EmployeeId;
              overtimeCount =0;
              paydayCutOff = setCutOffDate(shifts[shiftIndex].Start);

              SummaryObject[shifts[shiftIndex].pk_EmployeeId] = {
                Name:shifts[shiftIndex].Name,
                pk_EmployeeId: shifts[shiftIndex].pk_EmployeeId,
                Total: 0,
                RegHours: 0,
                Minutes: 0,
                OvertimeInMinutes: 0
              }
            }

            /* SUBTRACT BREAKTIME THEN ROUND */
           
            shiftLengthMinutes = moment(shifts[shiftIndex].End).diff(moment(shifts[shiftIndex].Start), 'minutes');

           console.log(" MATH ON EXTRA  : "+shifts[shiftIndex].Extra*60)

            if (shifts[shiftIndex].Extra !== 0) {

              shiftLengthMinutes = shiftLengthMinutes + (shifts[shiftIndex].Extra*60);
            }


            if (settingsStore.SettingsJSON.rounding === 'quarter') {
              shiftLengthMinutes = roundingFun(moment(shifts[shiftIndex].End).diff(moment(shifts[shiftIndex].Start), 'minutes')-shifts[shiftIndex].BreakTime)*60
              if (shifts[shiftIndex].Extra !== 0) {
                shiftLengthMinutes = shiftLengthMinutes + (shifts[shiftIndex].Extra*60)
              }
            
            }
            
            breakTime =  isNaN(shifts[shiftIndex].BreakTime) ? 0 : shifts[shiftIndex].BreakTime

            if (settingsStore.SettingsJSON.rounding !== 'quarter') {
            shiftLengthMinutes = shiftLengthMinutes - breakTime;
            }

            SummaryObject[currentPersonId].Total += shiftLengthMinutes;
            SummaryObject[currentPersonId].RegHours += shiftLengthMinutes;
            SummaryObject[currentPersonId].Minutes += shiftLengthMinutes;

          if (isBetween(paydayCutOff, shifts[shiftIndex].Start)) {
            overtimeCount += shiftLengthMinutes;
            if (shifts[shiftIndex].Extra !== 0) {
              overtimeCount = overtimeCount+ shifts[shiftIndex].Extra*60;
            }
           
          } else {
            SummaryObject[currentPersonId].OvertimeInMinutes += overtimeCount > 2400 ? overtimeCount - 2400: 0;
            overtimeCount = 0;
            paydayCutOff = setCutOffDate(shifts[shiftIndex].Start)
          }
            shiftLengthMinutes = 0;

            if (shiftIndex+1 === shifts.length) {
              SummaryObject[currentPersonId].OvertimeInMinutes += overtimeCount > 2400 ? overtimeCount - 2400: 0;
            }
          }

          setState({...state, loading:false, SummaryObject});
        }
        else {
          console.log(result.errorMessages);
        }
    
       }
       fetchData(startDate, endDate);

		return () => {
			mounted = false;
		}
  }, [settingsStore.StartDate, settingsStore.EndDate,  settingsStore.SelectedDepartment])
  

  
  return (
    <>
    <p style={{textAlign:'center'}}>Reports</p>
    {
      
      state.loading &&
      <div style={{position: "relative", display: "flex", margin: "5px", justifyContent: "center"}}>
        <div style={{display:"flex", justifyContent:"center", position:"absolute"}}>
          <LoadingWheel />
        </div>
      </div>
    }

{
      
      state.downloadMessage !== '' &&
      <div style={{position: "relative", display: "flex", margin: "5px", justifyContent: "center",}}>
        <div className="card" style={{ backgroundColor: "#fff", position:"absolute", height: "150px", width: "300px", zIndex: 3}}>
         <p style={{textAlign: 'center'}}> {state.downloadMessage}</p>
           <div style={{display:'flex', justifyContent:'center'}}>
            <button  onClick={()=> {setState({...state, downloadMessage:''})}}>Ok</button>
            </div>
        </div>
      </div>
    }
    <div style={{display: "grid", gridTemplateColumns: "minmax(120px, 300px) repeat(3, minmax(80px, 200px))", height: "100%", width: "100%"}}>
{/* headers */}
        <div>
          <p className="summaryCell">
          Date Range
          </p>
        </div>
        <div>
            <p className="summaryCell">
            Start
            </p> 
        </div>
        <div>
          <p className="summaryCell">
              End
          </p>   
        </div>
        <div>
        <button onClick={() => {downloadSummary(state.SummaryObject, 'csv', settingsStore.StartDate, settingsStore.EndDate)}}>Download CSV</button>
        </div>
        {/* other headers */}
        <div>
          <p className="summaryCell">
            Employee
          </p>  
        </div>
        <div>
        <p className="summaryCell">
          Reg Hours
        </p>  
        </div>
        <div>
          <p className="summaryCell">
            Overtime
          </p>  
        </div>
        <div>
        </div>
        {/* set of 4 divs. just keep adding divs surrounded by JSX.fragments <></> */}
        <SummaryRows SummaryObject={state.SummaryObject} />
    </div>
    </>

  )
}



export default SummaryTable;
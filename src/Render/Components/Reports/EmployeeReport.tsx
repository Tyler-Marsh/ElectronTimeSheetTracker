import React, {useContext, useEffect, useState} from 'react';
import { observer} from 'mobx-react-lite';
import '../../Css/styles.css';
import moment from 'moment';
import { RootStoreContext } from '../../Stores/RootStore';
import {Result} from '../../Models/Result';
import {getDateRange, buildPlaceholderShift} from './ReportHelpers';
import {ShiftModel}from '../../Models/ShiftModel'
import {ApiResult} from '../../Models/ApiResult';
import Loadingwheel from '../Loading/Loadingwheel';
import Week from './Week';
import Donation from '../Donate/Donation';

interface Props {
    StartDate: string;
    EndDate: string;
    Department: string;
    Name: string;
    EmployeeId: number;
}
   
interface State {
    needFetch: boolean;
    message: string;
    error: boolean;
    changeDate: boolean;
    action: string;
    loading: boolean;
    dateRange: Result<moment.Moment[]>;
    shiftArray: ShiftModel[][];
    asyncArray: Result<ShiftModel[]> | []
}
   
   function reducer(state: State, action: {type : string, message: string, index: number, shift: ShiftModel | undefined, shifts: ShiftModel[] | undefined}) {
       const { type, message, index, shift, shifts } = action;
       switch(type) {
           case 'start-date-greater-than-end': 
               return {...state, needFetch: false, message: "The shift start date shouldn't be greater than the end date"};
            case 'add-shift':
                return {...state, needFetch: true, action: 'add'}
            case 'edit-shift':
                return {...state, needFetch: true, action:'edit'}
            case 'fetched': 
                return{...state, needFetch :false, shiftArray:shifts, loading: false}
            case 'add':
                return{...state,}
            case 'loading': {
                return {...state, loading: true}
            }
            case 'done-loading': {
                return {...state, loading: false}
            }
           default:
               return {...state}
       }
   }
function Employee(Props: Props) {

    const {settingsStore} = useContext(RootStoreContext);
    
		const aState : State = {
            needFetch: false,
            message: '',
            error:false,
            changeDate: false,
            action:'',
            loading:false,
            shiftArray: [[]],
            asyncArray: [],
            dateRange : Result.fail([''])
		}
	
	const [state, setState] = useState(aState);

    const api = {
        get: async function () {
          await new Promise((r, e) => setTimeout(() => {
            const aRange : Result<moment.Moment[]> = getDateRange(settingsStore.StartDate, settingsStore.EndDate);
             r(aRange);
          }, 2000));
        }
    }

     async function loadDates(): Promise<Result<moment.Moment[]>> { 
         return new Promise((resolve, reject) => {
             setTimeout(() => {
                const aRange : Result<moment.Moment[]> = getDateRange(settingsStore.StartDate, settingsStore.EndDate);
                resolve(aRange)
             }, 750)
         })
     }


async function getShifts(db: string, StartDate: string, EndDate: string, EmployeeId: number) : Promise<any> {
    const ShiftModel: ApiResult<ShiftModel[]> = await window.e_Shift.GetSingleShifts(settingsStore.SelectedDb,StartDate, EndDate, Props.EmployeeId);
    return ShiftModel;
  }

	useEffect(() => {

        let mounted = true;   
        const fetchData = async (StartDate:string, EndDate:string) => {

            setState({...state, loading:true, dateRange: Result.fail([''])});
             const result: Result<moment.Moment[]> = await loadDates() // this takes 2000ms!
             
            const newStartDate = moment(StartDate, 'MM/DD/YYYY').set({hour:0,minute:0,second:0}).format('YYYY-MM-DD HH:mm:ss')
         
            const newEndDate = moment(EndDate, 'MM/DD/YYYY').set({hour:23,minute:59,second:59}).format('YYYY-MM-DD HH:mm:ss');

            const shifts: ApiResult<ShiftModel[]> = await  getShifts(settingsStore.SelectedDb, newStartDate, newEndDate, Props.EmployeeId)

            const aRange : Result<moment.Moment[]> = getDateRange(settingsStore.StartDate, settingsStore.EndDate);

            if (shifts.isSuccess) {

                let shiftsIndex = 0;
                let currentDate = moment(startDate, 'MM/DD/YYYY').format('YYYY-MM-DD');
                const theShifts = shifts.value;
                let newShifts = [];

                let dayOfWeek = parseInt(moment(settingsStore.StartDate, 'MM/DD/YYYY').format('d'));

                const weeks =[];
                let afterAddIncrement = true;

                // 
                const StartDate = settingsStore.SettingsJSON.payPeriodStartDate;
                let cutOffDate = 0;
            
                if (StartDate === 0) {
                    cutOffDate = 6;
                } else {
                    cutOffDate = StartDate - 1;
                }

                for (let i = 0; i < aRange.getValue().length; i++) {
                    afterAddIncrement = true;
                    if (theShifts[shiftsIndex] !== undefined && moment(theShifts[shiftsIndex].Start).format('YYYY-MM-DD') === currentDate) {
                        while(theShifts[shiftsIndex] !== undefined && moment(theShifts[shiftsIndex].Start).format('YYYY-MM-DD') === currentDate) {
                            theShifts[shiftsIndex].placeHolder = false;    
                            newShifts.push(theShifts[shiftsIndex]);
                            shiftsIndex++;  
                        }
                     
                        if (dayOfWeek === cutOffDate || aRange.getValue().length === i+1) {
                        
                            weeks.push(newShifts);
                            newShifts = [];
                            
                            dayOfWeek = dayOfWeek === 6? 0 : dayOfWeek+1;
                            afterAddIncrement= false;
                        }
                        
                        if (afterAddIncrement) {
                            dayOfWeek = dayOfWeek === 6? 0 : dayOfWeek+1;
                        }
                        currentDate = moment(currentDate).add(1, 'days').format('YYYY-MM-DD');
                        continue;
                    } else {
                    if (dayOfWeek === cutOffDate || aRange.getValue().length === i+1) {
                       
                        //dayOfWeek++;
                        newShifts.push(buildPlaceholderShift(currentDate));   
                        currentDate = moment(currentDate).add(1, 'days').format('YYYY-MM-DD');
                        weeks.push(newShifts);
                        newShifts = [];
                        dayOfWeek = dayOfWeek === 6 ? 0 : dayOfWeek+1;
                        continue
                    }
                        dayOfWeek = dayOfWeek === 6? 0 : dayOfWeek+1;
                        /*SWAPPED DATES*/
                        newShifts.push(buildPlaceholderShift(currentDate));
                        currentDate = moment(currentDate).add(1, 'days').format('YYYY-MM-DD');
                }}

                setState({...state, loading: false, dateRange: aRange, shiftArray: weeks});
            }

            else {
                setState({...state, loading: false, dateRange: aRange, shiftArray: [[]]})
            }
          };

          
        if (Props.EmployeeId === 0  || Props.EmployeeId === null) {
            return;
        }

        const startDate = settingsStore.StartDate;
        const endDate = settingsStore.EndDate;

       if (startDate?.length !== 10 || endDate?.length !== 10 || !moment(startDate, 'MM/DD/YYYY').isValid || 
            !moment(endDate, 'MM/DD/YYYY').isValid || moment(endDate).diff(moment(startDate), 'days') < 0
       )
       {
         
            return;
       }

        fetchData(startDate, endDate);
          
		return () => {
			mounted = false;
		}
	}, [settingsStore.StartDate, settingsStore.EndDate, settingsStore.SelectedEmployee, settingsStore.SelectedDepartment]
    );


    function DateHyphen() {
        return settingsStore.StartDate && settingsStore.EndDate ? '-' : ''
    }

  if(settingsStore.SelectedEmployeeId === 0) {
    return (
        <>
            <div className="card" style={{maxWidth: "95%", margin: "1rem auto"}}>
                <p style={{textAlign: "center", marginTop: "0rem", marginBottom: "2px"}}>Single employee</p>
                <div style={{display: "flex", justifyContent:"space-evenly", width: "50%"}}>
                                <p>{settingsStore.SelectedEmployee}</p>
                                <p>{settingsStore.StartDate} <span>{DateHyphen()}</span>  {settingsStore.EndDate}</p>
                </div>
            </div>
            <Donation />
          </>
    )
  }
  
    return(
        <div className="card" style={{maxWidth: "95%", margin: "1rem auto"}}>
             <p style={{textAlign: "center", marginTop: "0rem", marginBottom: "2px"}}>Single employee</p>
            {
                state.loading &&
                <div style={{display: 'flex', justifyContent:'center'}}>
                    <Loadingwheel />
                </div>
            }

                 {
                     state.dateRange.isFailure && 

                     state.dateRange?.errorMessages.map((error, index:number) => (
                         <div key={index}>
                            <p>
                                {error}
                            </p>
                         </div>
                     ))
                 }

                    {
                     state.dateRange.isSuccess && 
                    <>
                     <div style={{backgroundColor: "#E8E8E8", display: "flex", justifyContent:"space-between"}}>
                        <div style={{display: "flex", justifyContent:"space-evenly", width: "50%"}}>
                            <p>{settingsStore.SelectedEmployee}</p>
                            <p>{settingsStore.StartDate} - {settingsStore.EndDate}</p>
                        </div>
                        <div>
                        </div>
                     </div>
                        <table className="EmployeeTable" style={{gridColumn: "span 2"}}>
                            <thead>
                                <tr className="tableHeader">
                                    <th>Weekday</th>
                                    <th>Date</th>
                                    <th>In</th>
                                    <th>Out</th>
                                    <th>Extra Hours</th>
                                    <th>Break Time</th>
                                    <th>Total</th>
                                    <th>Comments</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    state.dateRange?.isSuccess && state.shiftArray.map((shift, index) => (       
                                        <Week key={index} shifts={shift} addShift='' />
                                    ))
                                }
                            </tbody>
                        </table>
                    </>           
                    }
                  <Donation />
             </div>
    )
}

export default observer(Employee);
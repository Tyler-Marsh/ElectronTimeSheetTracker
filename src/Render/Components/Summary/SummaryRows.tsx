import React, {Fragment, useContext} from 'react';
//import { ipcRenderer } from 'electron';
import {SummaryObject} from '../../Models/SummaryShift'
import history from "../../Helpers/history";
import { RootStoreContext } from '../../Stores/RootStore';

interface Props {
  SummaryObject: SummaryObject
}


function SummaryRows(Props: Props) {

  if (Object.keys(Props.SummaryObject).length === 0) {
    return (
      <>
      </>
    )
  }

  const {settingsStore} = useContext(RootStoreContext);

  function routeToEmployee(EmployeeName: string, EmployeeId: number) {
    settingsStore.setSelectedEmployee(EmployeeName,EmployeeId);
    history.push("/main/employee");
  }
 
  function getHoursMinutes(minutes: number): string{
    const hours = Math.floor(minutes/60);
    const modMinutes = minutes%60;
    return `${hours}h ${modMinutes}m`
  }


  return (
    <>
    {
      Object.keys(Props.SummaryObject).map((ob, index) => (
        <Fragment key={index}>
          <div className='summaryCell' style={{cursor: "pointer"}} onClick={() => {routeToEmployee(Props.SummaryObject[parseInt(ob)].Name,Props.SummaryObject[parseInt(ob)].pk_EmployeeId)}}><p>{Props.SummaryObject[parseInt(ob)].Name}</p></div>
          <div className='summaryCell'><p>{getHoursMinutes(Props.SummaryObject[parseInt(ob)].RegHours)}</p></div>
          <div className='summaryCell'><p>{getHoursMinutes(Props.SummaryObject[parseInt(ob)].OvertimeInMinutes)}</p></div>
          <div className='summaryCell'><p>{getHoursMinutes(Props.SummaryObject[parseInt(ob)].Total)}</p></div>
        </Fragment>
      ))
    }
    </>

  )
}

export default SummaryRows
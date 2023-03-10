import React, {useContext, useState} from 'react'
import {ShiftModel} from '../../Models/ShiftModel';
import moment from 'moment';
import AddEditShift from './AddEditShift';
import { RootStoreContext } from '../../Stores/RootStore';
import {roundingFun} from '../../Helpers/rounding'
import Modal from '../Containers/Modal';
import Comments from './Comments';

interface Props {
  Shift: ShiftModel;
  Index: number;
  showDateInfo: boolean;
  selectModal: any;
}


function DateRow(Props: Props) {


  const minutesToHM = (minutes: number) :string =>  {

    if (!minutes) {
      return '';
    }

    const hours = Math.floor(minutes/60);
    const finalMinutes = minutes%60;
    return `${hours}h ${finalMinutes}m`
}


  const [state, setState] = useState(false);
  const {Shift, Index} = Props;
  const {employeeStore, settingsStore} = useContext(RootStoreContext);

  function getTotal(startTime: any, endTime: any) {

    // make roundigFun take in the dates and take care of the rest.
    // it will return a string. This implments separation of concerns
    // so it is simple and an user of the funciton doesn't need to know how it works
    // they can just call it instead of setting up all this boiler plate logic that is hard to process
    let shiftLengthMinutes = moment(endTime).diff(moment(startTime), 'minutes');

  
    if (Shift.BreakTime !== 0 && !isNaN(Shift.BreakTime)) {
      shiftLengthMinutes = shiftLengthMinutes- Shift.BreakTime;
    }

    if (Shift.Extra !== 0) {
      shiftLengthMinutes= shiftLengthMinutes + Shift.Extra*60;
    }
    
    if (settingsStore.SettingsJSON.rounding === 'quarter') {

     const result = roundingFun(shiftLengthMinutes);     
     const hours = Math.floor(result);
     const minutes = result*60 % 60
     return `${hours}h ${minutes}m`
     
    }
    const hours = Math.floor(shiftLengthMinutes/60)
    const minutes = shiftLengthMinutes%60;
    return `${hours}h ${minutes}m`
  }


  if (Shift.placeHolder === true) {
    return (
      <tr key={Index}>
          <td className="shiftCell">{moment(Shift.Start, "YYYY-MM-DD HH:mm:ss").format("ddd")}</td>
          <td className="shiftCell">{moment(Shift.Start, "YYYY-MM-DD HH:mm:ss").format("MM/DD")}</td>
          {/* IN */}
          <td className="shiftCell"></td>
          {/* OUT */}
          <td className="shiftCell"></td>
          {/* EXTRA */}
          <td className="shiftCell"></td>
          {/* TOTAL BREAK TIME */}
          <td className="shiftCell"></td>
          {/* TOTAL */}
          <td className="shiftCell"></td>
          {/* COMMENTS */}
          <td className="shiftCell"></td>
          {/* ACTIONS */}
          <td>
           <button className="shiftButton"  style={{fontSize: '12px'}}  onClick={() => {Props.selectModal(Index, 'add')}}>Add</button>
          </td>
         
                  
      </tr>
    )
  }
  else {

    console.log("SHIFT EXTRA: "+ Shift.Extra);
    const theComments = <Comments close={()=> {setState(false)}} comments={Props.Shift.Comments} />
    const commentsButton = <button onClick={()=> {setState(true)}}>...</button>;
    return (
      <>
        <Modal close={() => setState(false)} show={state} childComponent={theComments} ></Modal>
        <tr key={Props.Index}>
            <td className="shiftCell">{Props.showDateInfo && moment(Shift.Start, "YYYY-MM-DD HH:mm:ss").format("ddd")}</td>
            <td className="shiftCell">{Props.showDateInfo && moment(Shift.Start, "YYYY-MM-DD HH:mm:ss").format("MM/DD")}</td>
            {/* IN */}
            <td className="shiftCell">{moment(Shift.Start, "YYYY-MM-DD HH:mm:ss").format("h:mm a")}</td>
            {/* OUT */}
            <td className="shiftCell">{moment(Shift.End, "YYYY-MM-DD HH:mm:ss").format("h:mm a")}</td>
            {/* EXTRA */}
            <td className="shiftCell">{Shift.Extra === undefined ? "0" : Shift.Extra}</td>

            {/* BREAK TIME  */}
            <td className="shiftCell">{minutesToHM(Shift.BreakTime)}</td>

            {/* TOTAL */}
            <td className="shiftCell">{getTotal(Shift.Start, Shift.End)}</td>
            {/* COMMENTS */}
            <td className="shiftCell">{
              Props.Shift.Comments !== ''
              && commentsButton
            }</td>
            {/* ACTIONS */}
            <td>
            <button className="shiftButton" style={{fontSize: '12px'}} onClick={() => {Props.selectModal(Index, 'add')}}>Add</button>
            <button  className="shiftButton" style={{fontSize: '12px'}}  onClick={() => {Props.selectModal(Index, 'edit')}}>Edit</button>
            <button  className="shiftButton" style={{fontSize: '12px'}}  onClick={() => {Props.selectModal(Index, 'delete')}}>Delete</button>
            </td>
        </tr>
      </>
    )
  }
}

export default DateRow
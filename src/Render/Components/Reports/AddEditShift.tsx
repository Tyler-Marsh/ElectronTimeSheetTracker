import React, {useState, useContext} from 'react'
import Modal from '../Containers/Modal';
import AddEditShiftForm from './AddEditShiftForm';
import {ShiftModel} from '../../Models/ShiftModel';
import { RootStoreContext } from '../../Stores/RootStore';


interface Props {
  type: "edit" | "add";
  title: string;
  date: string;
  shiftId: number;
  employeeId:number;
  submit: any;
  breakTime: number;
}

function AddEditShift(Props: Props) {

const {employeeStore, settingsStore} = useContext(RootStoreContext);
const editShift = (Shift: ShiftModel) => {
  return ""
}
let childComponent: any
  const [show, setShow] = useState(false);
  
  const Close = () => {
    setShow(false);
}
  if (Props.type === 'add') {
    childComponent = <AddEditShiftForm 
                              type="add" title="Enter a new shift" submit={Props.submit}
                              date={Props.date} 
                              shiftId={"0"}
                              in={"08:00 am"}
                              out={"05:00 pm"}
                              extra={""}
                              comments={""}
                              close={Close}
                              employeeId={Props.employeeId}
                              BreakTime={Props.breakTime}
                            />
  }
  else {
    childComponent= <AddEditShiftForm
    type="edit" title="Enter a new shift" submit={''} 
    date={Props.date} 
    shiftId={"0"}
    in={"12:00 am"}
    out={"04:00 pm"}
    extra={""}
    comments={""}
    close={Close}
    employeeId={Props.employeeId}
    BreakTime={Props.breakTime}
  />
  }

  return (
    <>
      <button style={{fontSize:"16px"}} onClick={() => {setShow(true)}}>
        {Props.type}
      </button>
      <Modal show={show} close={Close} childComponent={childComponent} />
    </>
  )
}
export default AddEditShift
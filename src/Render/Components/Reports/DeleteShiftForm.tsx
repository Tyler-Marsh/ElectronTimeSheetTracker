import React, {useState} from 'react'
import {ShiftModel} from '../../Models/ShiftModel';
import moment from 'moment'
import DbSingleResult from '../../Models/DbSingleResult';

interface Props {
  shift: ShiftModel;
  index: number;
  submit: any
  close: any;
}

function DeleteShiftForm(Props: Props) {


  const [state, setState] = useState({message: '', step: 1})

  const submit = async () => {
    const result: DbSingleResult = Props.submit(Props.shift.pk_ShiftId, Props.shift.Start);
    setState({message: result.message, step: 2});

  }


  if (state.step === 1) 
  {

    const StartMoment = moment(Props.shift.Start);
    const EndMoment = moment(Props.shift.End);
    const StartDay = StartMoment.format('dddd');
    const StartDate = StartMoment.format('d')
    const StartMonth = StartMoment.format('MMMM')
    const StartTime = StartMoment.format('hh:mm a');
  
    const EndDay = EndMoment.format('dddd');
    const EndTime = EndMoment.format('hh:mm a');
    const EndMonth = EndMoment.format('MMMM');
    const EndDate = EndMoment.format('d')

    return (
    <>
    <p style={{textAlign: "center", marginTop: "0rem", borderBottom: "1px solid gainsboro"}}>Delete Current Shift?</p>
                  <div style={{height: "2rem", margin: "0px auto", width: "50%"}}></div>
                      <p>Start {StartDay} {StartMonth} {StartDate}, {StartTime}</p>
                      <p>End {EndDay} {EndMonth} {EndDate}, {EndTime}</p>
                      <p>Extra: {Props.shift.Extra}</p>
                      <p>{Props.shift.Comments}</p>
                  <div className="formGroup" style={{textAlign: "center", marginTop: "1rem"}}>
                      <button onClick={() => {submit()}}>Submit</button>
                  </div>
    </>
    )
  } else {
    return (
      <>
      <p style={{textAlign: "center", marginTop: "0rem", borderBottom: "1px solid gainsboro"}}>Delete Shift?</p>
                  <div style={{height: "2rem", margin: "0px auto", width: "50%"}}>Shift Deleted!</div>
                    <pre style={{backgroundColor: "gainsboro", color: "grey"}}>
                       
                    </pre>
                  <div className="formGroup" style={{textAlign: "center", marginTop: "1rem"}}>
                      <button onClick={() => {Props.close()}}>Ok</button>
                  </div>
      </>
    )
  }
}

export default DeleteShiftForm
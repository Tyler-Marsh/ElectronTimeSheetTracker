import React, {useState, useContext} from 'react';
import NavigationBar from '../Navigation/NavigationBar';
import history from "../../Helpers/history";
import { RootStoreContext } from '../../Stores/RootStore';
import Modal from '../Containers/Modal'
import SettingsMessage from './SettingsMessage';
import Donation from '../Donate/Donation';


function Settings() {


  const {settingsStore} = useContext(RootStoreContext);
//  settingsStore?.SettingsJSON?.payPeriodStartDate, rounding: settingsStore?.SettingsJSON?.rounding
  let initialRounding = settingsStore?.SettingsJSON?.rounding;
  let initialPayPeriod = settingsStore?.SettingsJSON?.payPeriodStartDate;
  const [state, setState] = useState({payPeriodStartDate:initialPayPeriod, rounding: initialRounding, message:''});

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wendesday', 'Thursday', 'Friday', 'Saturday'];

  const handlePayPeriodStart = (event: React.ChangeEvent<HTMLSelectElement>) => {

    setState({...state, payPeriodStartDate: parseInt(event.target.value)});

  }

  const handleRounding = (event:React.ChangeEvent<HTMLInputElement>) => {
   
    if (state.rounding === event.target.value) {
      setState({...state, rounding:'none'});
      return;
    }
    setState({...state, rounding:event.target.value})
  }

  const submitSettings = async () => {
    const result = await window.e_Settings.ChangeSettings(settingsStore.SelectedDb, state);
    if (result.success) {
      settingsStore.setSettingsJSON({rounding: state.rounding, payPeriodStartDate: state.payPeriodStartDate})
      setState({...state, message: result.message})
    }
  }

  const closeModal = () => {
    setState({...state, message: ''})
  }

  const SettingsMessage1 = <SettingsMessage message={state.message} close={closeModal} />
  return (
        <>
        {state.message !== '' &&
        <Modal show={true} close={closeModal} childComponent={SettingsMessage1} />
        }
          <NavigationBar />
          <div className="card" style={{maxWidth:"95%", margin: "1rem auto", paddingBottom: "2rem"}}>
            <p style={{textAlign:"center"}}>Settings</p>
            <div className="settingsContainer" style={{display:"flex", justifyContent:"space-around"}}>
              <div >
              <h3 style={{textAlign:'center'}}>Pay period start day</h3>
                <form style={{display:"flex" ,flexDirection:"row", justifyContent:'center'}}>
                 <select onChange={(event) => {handlePayPeriodStart(event)}} value={state.payPeriodStartDate} name="startDay" id="startDay">
                 {
                   days.map((day: string, index: number) => (
                      <option  key={day+index} value={index}>{day}</option>    
                   ))
                 }
                 </select>     
                </form>
              </div>
              <div>
                <h3 style={{textAlign:'center'}}>Rounding total shift time</h3>
                <div style={{display:"flex", justifyContent:'center'}}>
                <label style={{display:"block"}}>Quarter Hour:</label>
                <input onChange={(event) => {handleRounding(event)}} checked={state.rounding === 'quarter'} style={{display:"block", textAlign:'center'}}type="checkbox" id="quarterhour" value="quarter"></input>
                </div>
              </div>
             
            </div>
            <div  style={{display:"flex", justifyContent:'center', marginTop: "2rem"}}><button onClick={() => {submitSettings()}}>save</button></div>
          </div>
          <Donation></Donation>
        </>
  )
}
export default Settings
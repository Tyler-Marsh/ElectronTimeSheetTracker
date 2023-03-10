import React, {useContext} from 'react';
import {RootStoreContext} from '../../Stores/RootStore'
import { observer} from 'mobx-react-lite';


function Donation() {

const {employeeStore, settingsStore} = useContext(RootStoreContext);

return (
    <>
    { settingsStore.ShowDonation &&

    <div className="card" style={{maxWidth:"95%", margin: "1rem auto", display: 'flex', flexDirection:'row', justifyContent:'center',  alignItems:"center"}}>
        <p style={{textAlign:'left'}}>If you find this app useful, check out the <a style={{color: "#0b0de6"}} target="_blank" href="https://www.patreon.com/user?u=69965597&fan_landing=true">patreon page </a></p>
        <button onClick={(e) => {settingsStore.setShowDonation(false)} } style={{height:'1rem', marginBottom: "10px", marginLeft:"1rem"}} className="modal-close-button">&times;</button>
    </div>
    }
    </>
)
}

export default observer(Donation);
import React from 'react';

interface Props {
    message: string;
    close: any;
}

function SettingsMessage(Props: Props) {
    return (
        <>
            <p style={{textAlign:'center',borderBottom: "1px solid gainsboro"}}>
                Settings
                <br></br>
            </p>
            <p style={{textAlign:'center', marginTop: "2rem"}}>{Props.message}</p>
            <div style={{display:'flex', justifyContent:'center'}}>
            <button  style={{marginTop: "1rem"}} onClick={() => {Props.close()}}>
                OK
            </button>
            </div>
        </>
    )
}

export default SettingsMessage
import React from 'react';

interface Props {
    close: any;
    comments: string;
}


function Comments(Props: Props) {
    return (
        <div style={{textAlign:'center'}}>
            <p style={{borderBottom: "1px solid gainsboro"}}>Shift Comments</p>
            <p style={{color: "#505050", marginTop: "1rem"}}>{Props.comments}</p>
            <div style={{display:"flex", justifyContent: "center"}}>
                <button style={{marginTop: "1rem"}} onClick={() => {Props.close()}}>OK</button>
            </div>
        </div>
    )
}
export default Comments;
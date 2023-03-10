import '../../Css/styles.css';
import React, {ReactElement, useState} from 'react';
// import { arrayExtensions } from 'mobx/dist/internal';
import { Link } from 'react-router-dom';
//const electron = window.require('electron') 
// const {ipcRenderer} = electron;
interface Props {
    To: string;
    HoverMessage: string;
    Name: string;
    Underline: boolean;
}

// make Link have a relative position
// create state holding HoverMessage
// event for when something hovers over it.
// that will trigger show in state which will show a hover description
export default function MainNavLink(Props: Props) : ReactElement {

    const [show, setShow] = useState(false);
    return (
      
       <div style={{position:"relative", margin: ".5rem auto" }}>
            <Link  className="mainLink" to={Props.To}
            style={{borderBottom: Props.Underline ? '2px solid #0074d9' : '0'}}
            onMouseEnter={() => {setShow(true)}}
            onMouseLeave={() => {setShow(false)}}>
            {Props.Name}
            </Link>
            {show && 
            <>
                <div className="tooltipTriangle"></div>
                <p className="tooltip">{Props.HoverMessage}</p>
            </>
            }
      </div>
    
    )

}
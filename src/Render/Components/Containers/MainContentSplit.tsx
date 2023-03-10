import React, { ReactElement } from 'react';
import history from '../../Helpers/history'
import useWindowDimensions from '../../Helpers/DimensionsHook';
import '../../Css/styles.css';
import { observer} from 'mobx-react-lite';

interface Props {
    left: React.FC
    right: React.FC
}
//<p style={{wordBreak: "break-all"}}></p>
function MainContentSplit(Props: Props) : ReactElement {

    
    const { width } = useWindowDimensions();
    return (
        <>
         <p style={{textAlign:'center'}}>Add/Remove</p>
      
            <div className="mainContentCard" style={{minHeight: "400px", position:"relative"}}>
               
                <div style={{gridArea: "main"}}>
                <Props.left />
                </div>            
                <div className={width > 600 ? "verticalBarLeft" : "verticalBarTop" } style={{gridArea: "side", height: "100%"}} >
               <Props.right />
                </div>             
            </div>
        </>
    )
}

export default observer(MainContentSplit);
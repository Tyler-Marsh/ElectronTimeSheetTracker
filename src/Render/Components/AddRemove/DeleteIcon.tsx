import React, {useState} from 'react';


interface Props {
    message: string;
}
function DeleteIcon(Props : Props) : JSX.Element {

    const [showToolTip, setShowToolTip] = useState(false);

    return (
    <>
    <i
        onMouseEnter={() => {setShowToolTip(true)}}
        onMouseLeave={() => {setShowToolTip(false)}} 
    >
        &#9986;</i>
        {showToolTip && 
                        <>
                        <div className="tooltipTriangle"></div>
                        <p className="tooltip">{Props.message}</p>
                        </>
                        }
    </>
    )
}

export default DeleteIcon;
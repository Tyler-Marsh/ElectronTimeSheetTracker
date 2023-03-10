import React, {useState} from 'react';



function EditIcon() : JSX.Element {

    const [showToolTip, setShowToolTip] = useState(false);

    return (
    <>
    <i
        onMouseEnter={() => {setShowToolTip(true)}}
        onMouseLeave={() => {setShowToolTip(false)}} 
    >
        &#9998;</i>
        {showToolTip && 
                        <>
                        <div className="tooltipTriangle"></div>
                        <p className="tooltip">Edit info</p>
                        </>
                        }
    </>
    )
}

export default EditIcon;
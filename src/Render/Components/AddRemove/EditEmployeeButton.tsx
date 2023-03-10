import React, {useState, useReducer} from 'react';
import {observer} from 'mobx-react-lite';
import Modal from '../Containers/Modal';
import EditEmployee from './EditEmployee';
import EditIcon from './EditIcon';

interface Props {
    Name: string;
    Department: string;
    id: number;
}

interface State {
 showForm: boolean;
 showToolTip: boolean;

}

// can created a selected employee in MobX
// problem being that maybe it could be a shared value
// then reseting it every time you need it
// component={<SomeInnerComponent someProp={'someInnerComponentOwnProp'}/>}
function EditEmployeeButton(Props: Props) {

    const [showForm, setShowForm] = useState(false);

    const Close = () => {
        setShowForm(false);
    }


    const  editEmployee = <EditEmployee close={Close} employeeId={Props.id} />
    return (
        <>
            <button className="cellButton" 
                onClick={() => {setShowForm(true)}}
            >
                <EditIcon />
            </button>
            <Modal childComponent={editEmployee} show={showForm} close={Close} />
        </>
    );

    }

export default observer(EditEmployeeButton);
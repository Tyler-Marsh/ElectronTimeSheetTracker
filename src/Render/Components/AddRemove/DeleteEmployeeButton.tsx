import React, {useState, useReducer} from 'react';
import {observer} from 'mobx-react-lite';
import Modal from '../Containers/Modal';
import DeleteEmployee from './DeleteEmployee';
import DeleteIcon from './DeleteIcon';

interface Props {
    Name: string;
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
function DeleteEmployeeButton(Props: Props) {

    const [showForm, setShowForm] = useState(false);

    const Close = () => {
        setShowForm(false);
    }


    const  deleteEmployee = <DeleteEmployee close={Close} employeeId={Props.id} />
    return (
        <>
            <button className="cellButton" 
                onClick={() => {setShowForm(true)}}
            >
                <DeleteIcon message={"Delete Employee"}/>
            </button>
            <Modal childComponent={deleteEmployee} show={showForm} close={Close} />
        </>
    );

    }

export default observer(DeleteEmployeeButton);
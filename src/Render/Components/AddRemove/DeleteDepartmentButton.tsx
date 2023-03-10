import React, {useState, useReducer} from 'react';
import {observer} from 'mobx-react-lite';
import Modal from '../Containers/Modal';
import DeleteDepartment from './DeleteDepartment';
import DeleteIcon from './DeleteIcon';

interface Props {
    Name: string;
    id: number;
}

interface State {
 showForm: boolean;
 showToolTip: boolean;

}
function DeleteDepartmentButton(Props: Props) {

    const [showForm, setShowForm] = useState(false);

    const Close = () => {
        setShowForm(false);
    }


    const  deleteEmployee = <DeleteDepartment close={Close} Name={Props.Name} departmentId={Props.id} />
    return (
        <>
            <button className="cellButton" 
                onClick={() => {setShowForm(true)}}
            >
                <DeleteIcon message={"Delete Department"}/>
            </button>
            <Modal childComponent={deleteEmployee} show={showForm} close={Close} />
        </>
    );

    }

export default observer(DeleteDepartmentButton);
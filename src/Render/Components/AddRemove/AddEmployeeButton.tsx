import React, {useState} from 'react';
import {observer} from 'mobx-react-lite';
import Modal from '../Containers/Modal';
import Employee from './Employee';

function AddEmployeeButton() {

    const [showForm, setShowForm] = useState(false);

    const Close = () => {
        setShowForm(false);
    }

    const anEmployee = <Employee close={Close} />
    return (
        <div className="addRemoveItem">
            <label  className="mainLabel" htmlFor="">
                Add
            </label>
            <div className="HoldItem">
                <button className="mainButton" id="addEmployee" onClick={() => {setShowForm(true)}}>
                    +
                </button>
            </div>
            <Modal childComponent={anEmployee} show={showForm} close={Close} />
        </div>
    );
}

export default observer(AddEmployeeButton);
import React, {useState} from 'react';
import {observer} from 'mobx-react-lite';
import Modal from '../Containers/Modal';
import EditDepartment from './EditDepartment';
import EditIcon from './EditIcon';

interface Props {
    Name: string;
    id: number;
}

// can created a selected employee in MobX
// problem being that maybe it could be a shared value
// then reseting it every time you need it
// component={<SomeInnerComponent someProp={'someInnerComponentOwnProp'}/>}
function EditDepartmentButton(Props: Props) {

    const [showForm, setShowForm] = useState(false);

    const Close = () => {
        setShowForm(false);
    }


    const  editDepartment = <EditDepartment close={Close} departmentId={Props.id}  Name={Props.Name} />
    return (
        <>
            <button className="cellButton" 
                onClick={() => {setShowForm(true)}}
            >
                <EditIcon />
            </button>
            <Modal childComponent={editDepartment} show={showForm} close={Close} />
        </>
    );

    }

export default observer(EditDepartmentButton);
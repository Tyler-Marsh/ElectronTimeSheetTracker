import React, {useState, useContext} from 'react';
import { observer} from 'mobx-react-lite';
import Modal from '../Containers/Modal';
import AddDepartment from './AddDepartment';
import { RootStoreContext } from '../../Stores/RootStore';
import EditDepartmentButton from './EditDepartmentButton';
import DeleteDepartmentButton from './DeleteDepartmentButton';


function AddRemoveDepartments() {

    const [show, setShow] = useState(false);
    const Close = () => {
        setShow(false);
    }
    const anAddDepartment = <AddDepartment close={Close} />
    const {departmentStore} = useContext(RootStoreContext);

    const departments = Object.keys(departmentStore.Departments);
   

    return (
        <div className="addRemoveFlex">
           <div className="addRemoveItem">
            <label htmlFor="" className="mainLabel">Departments</label>
           </div>
           <div className="addRemoveItem">
               <div className="mainLabel">Add</div>
               <div className="HoldItem">
                 <button className="mainButton" onClick={() => {setShow(true)}}>+</button>
                 <Modal show={show} close={Close} childComponent={anAddDepartment} />
               </div>
           </div>
           <div className="holdEmployees" style={{maxHeight:"600px", marginLeft: ".5rem", overflowY: "auto", width: "100%"}}>
            <div style={{marginLeft:".5rem", display: "flex", flexDirection:"row", justifyContent:"start"}}>
              <div style={{display:"flex", justifyContent:"center", width: "7rem"}}>
                          <label style={{fontSize: ".75rem",color: "#0074d9"}}>Department</label>
              </div>
            </div>
            </div>
            <div className="holdEmployees">
          {
              departments.map((department, key) => (
                <div key={key} style={{display: "flex", flexDirection:"row", justifyContent:"start"}}>
                        <p className="cell" style={{width:"7rem"}}>{departmentStore.Departments[parseInt(department)]}</p>
                        <EditDepartmentButton  Name={departmentStore.Departments[parseInt(department)]} id={parseInt(department)} />
                        <DeleteDepartmentButton Name={departmentStore.Departments[parseInt(department)]} id={parseInt(department)} />
                    </div>
              ))
          }
          </div>
        </div>
    )
}
 /* Object.entries().map((department, key) =>  (
                (<div key={key} style={{display: "flex", flexDirection:"row", justifyContent:"start"}}>
                        <p className="cell" style={{width:"7rem"}}>{departmentStore.Departments[parseInt(department)]}</p>
                    </div>)
           )) */
export default observer(AddRemoveDepartments);
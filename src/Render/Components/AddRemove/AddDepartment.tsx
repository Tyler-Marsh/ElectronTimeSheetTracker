import React, {useState, useContext} from 'react';
import DbSingleResult  from '../../Models/DbSingleResult';
import { RootStoreContext } from '../../Stores/RootStore';


interface Props {
     // eslint-disable-next-line @typescript-eslint/no-explicit-any
    close: any;
}

function AddDepartment(Props: Props) :JSX.Element {

    
const [state, setState]  = useState(
    {
    Name: "",
    Step: 1,
    APISuccess: null,
    APIMessage: '',
    });

    const {departmentStore, settingsStore} = useContext(RootStoreContext);

    const FormChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement >) : void => {
        
        const {name, value} = event.target;
        setState({...state, [name]: value});
        return;
    }

    

    const Submit = async (): Promise<void> =>  {

        console.log("submitting *(()*");
       const result : DbSingleResult = await window.e_AddRemove.AddDepartment(settingsStore.SelectedDb ,{Name: state.Name, pk_DepartmentId: 0});   
    if (result.success) {
        //anEmployee.pk_EmployeeId = result.rowId;
        //employeeStore.AddEmployee(anEmployee);
        departmentStore.AddDepartment({Name: state.Name, pk_DepartmentId: result.rowId});

        setState({...state, Step: 2, APISuccess: true, APIMessage: result.message,  Name: ''})
        
        return;
    }
    setState({...state, APISuccess: false, APIMessage: result.message});
    }
                                                        
    

    
    if (state.Step === 1)
    {
        return(
            <>
                <p style={{textAlign: "center", marginTop: "0rem", borderBottom: "1px solid gainsboro"}}>Create new department</p>
                <div style={{height: "2rem", margin: "0px auto", width: "50%"}}></div>
                <div className="formGroup">
                    <label className="formLabel" htmlFor="Name">Department Name</label>
                    <input onChange={(e) => {FormChange(e)}} type="text" className="formInput" placeholder="Department Name" name="Name"></input>
                </div>
    
    
                <div className="formGroup">
                    <button onClick={() => {Submit()}}>Submit</button>
                </div>
            </>
        )}
            
        return (
            <>
             <p style={{textAlign: "center", marginTop: "0rem", borderBottom: "1px solid gainsboro"}}>Create new department</p>
                <div style={{height: "2rem", margin: "0px auto", width: "50%"}}></div>
                <p style={{textAlign: "center"}}>{state.APIMessage}</p>
                <div className="formGroup">
                    <button onClick={Props.close}>Ok</button>
                </div>
            </>
        )         
}


export default(AddDepartment)
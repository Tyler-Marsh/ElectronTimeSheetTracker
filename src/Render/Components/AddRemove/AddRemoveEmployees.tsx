import '../../Css/styles.css';
import React, {useContext, useReducer} from 'react';
import { observer } from 'mobx-react-lite';
import { RootStoreContext } from '../../Stores/RootStore';
import AddEmployeeButton from './AddEmployeeButton';
import EditEmployeeButton from './EditEmployeeButton';
import DeleteEmployeeButton from './DeleteEmployeeButton';

interface State {
	loading: boolean;
	// needFetch: boolean;
    filterName: string | null;
    filterDepartment: number | null;
    showForm: boolean;
}

function reducer(state: State, action: {type : string, filterName: string, filterDepartment: number}) {
	const { type, filterName, filterDepartment } = action;

	switch(type) {
        case 'done-loading':
            return {...state, loading: false};
		case 'fetching': 
			return {...state, loading: true, showForm : false};
        case 'show-form':
            return {...state, showForm: true};
        case 'close-form':
            return {...state, showForm: false};
        case 'filter-department': 
            return {...state,   filterDepartment };
        case 'filter-name':
            return {...state, filterName};
		default:
			return {...state}
	}
}

function AddRemoveEmployees() {
  
		const aState : State = {
			loading: true,
			// needFetch: true,
			filterName: null,
            filterDepartment: null,
            showForm: false,
		}

	const [state, dispatch] = useReducer(reducer, aState);
    const {employeeStore, departmentStore} = useContext(RootStoreContext);

    let employees = employeeStore.Employees;

    const forRegex = "^" + state.filterName + ".+|" + state.filterName;
    const reg = new RegExp(forRegex, 'i');

    
    if (state.filterName !== null && state.filterName.trim() !== "") {
      employees = employees.filter((employee) => {return reg.test(employee.Name)});
     
    }
    
    if (state.filterDepartment !== null && state.filterDepartment !== 0) {
        employees = employees.filter((employee) => {return state.filterDepartment === employee.fk_DepartmentId})
    }

    
const CloseForm = () => {
    //  payload:{filterName: e.target.value, filterDepartment: 0}}
    dispatch({ type: 'close-form', filterName: '', filterDepartment: 0 });
}

const ShowForm = () => {
    dispatch({type: 'show-form', filterName: '', filterDepartment: 0});
}

    return (
        <div>
            <div className="addRemoveFlex">
                <div className="addRemoveItem">
                    <label className="mainLabel" htmlFor="searchEmployee">
                        Employees
                    </label>
                    <div className="holdItem">
                        <input name="searchEmployee" value={state.filterName === null ? "" : state.filterName} onChange={(e) => {dispatch({type: 'filter-name', filterName: e.target.value, filterDepartment: 0})}} type="text" id="searchEmployee" style={{marginRight: "5px", fontSize: ".75rem", width: "7rem"}} />
                        <button className="searchLogo">
                            <div style={{height: "100%", width: "100%", display: "flex", justifyContent:"center", alignContent:"center"}}>
                            <label style={{fontSize: "80%"}}>&#128269;</label>
                            </div>
                        
                        </button>
                    </div>
                </div>

                <div className="addRemoveItem">
                   <label className="mainLabel" htmlFor="">
                    Department
                   </label>
                   <div className="holdItem">
                      <select  onChange={
                          (e) => {
                              dispatch({type: 'filter-department', filterName: '', filterDepartment: parseInt(e.target.value) })
                          }}  value={state.filterDepartment === null ? undefined: state.filterDepartment} style={{width: "100%"}} name="" id="Departments">
                          <option value="0">
                              All
                          </option>
                          {Object.keys(departmentStore.Departments).map((department, key) => (
                        <option value={department} key={key}>
                            {departmentStore.Departments[parseInt(department)]}
                        </option>
                    ))}
                        
                      </select>
                   </div>
                </div>
                <AddEmployeeButton />
            </div>
            {/*ITERATE OVER EMPLOYEES*/}
            <div className="holdEmployees" style={{maxHeight:"600px", marginLeft: ".5rem", overflowY: "auto"}}>
            <div style={{marginLeft:".5rem", display: "flex", flexDirection:"row", justifyContent:"start"}}>
              <div style={{display:"flex", justifyContent:"center", width: "7rem"}}>
                          <label style={{fontSize: ".75rem",color: "#0074d9"}}>Name</label>
              </div>
              <div style={{display:"flex", justifyContent:"center", width: "7rem"}}>
                          <label style={{fontSize: ".75rem", color: "#0074d9"}}>Department</label>
              </div>
              
            </div>
            </div>
            <div className="holdEmployees" style={{maxHeight:"600px", marginLeft: ".5rem", overflowY: "auto"}}>
            {employees.map((employee, key) =>  (
                (<div key={key} style={{display: "flex", flexDirection:"row", justifyContent:"start"}}>
                        <p className="cell" style={{width:"7rem"}}>{employee.Name}</p>
                        <p className="cell" style={{width:"7rem"}}>{departmentStore.Departments[employee.fk_DepartmentId] === undefined ? "Any" : departmentStore.Departments[employee.fk_DepartmentId]}</p>
                        <EditEmployeeButton Name={employee.Name} id={employee.pk_EmployeeId} Department={departmentStore.Departments[employee.fk_DepartmentId] === undefined ? "Any" : departmentStore.Departments[employee.fk_DepartmentId]} />
                        <DeleteEmployeeButton Name={employee.Name} id={employee.pk_EmployeeId} />
                    </div>)
                ))}
            </div>
           </div>
    )
}

export default observer(AddRemoveEmployees);
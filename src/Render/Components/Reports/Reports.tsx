import '../../Css/styles.css';
import React, {useContext, useReducer} from 'react';
//import {useContext} from 'react';
import { RootStoreContext, useStore } from '../../Stores/RootStore';
// import { arrayExtensions } from 'mobx/dist/internal';
import history from '../../Helpers/history';
import NavigationBar from '../Navigation/NavigationBar'
import Employee from './EmployeeReport';
import Employees from './EmployeesReport';
import {useRouteMatch } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import DateControl from '../DateControls/DateControl';
import FilterDepartmentButton from './FilterDepartmentButton';
import FilterNameButton from './FilterNameButton';

// import EmployeesModel, { EmployeeModel } from '../../Models/EmployeeModel';
import EmployeesModel, {EmployeeModel} from '../../Models/EmployeeModel';

interface State {
    filterDepartmentName: string;
    filterDepartmentKey: number;
    showDepartmentFilter: boolean;
    showNameFilter: boolean;
    filterName: string;
    rerender: number;
}

/* I can lift it up to use MobX and just go based on mobX state */

function reducer(state: State, action : {type: string, filterDepartmentName: string, filterDepartmentKey: number, filterName: string}) {
    const { type, filterDepartmentName, filterDepartmentKey, filterName} = action;
    const showDepartmentFilter = state.showDepartmentFilter;
    const showNameFilter = state.showNameFilter;
    
    switch(type) {
        case 'filter-department': {
            return {...state, filterDepartmentName, filterDepartmentKey, showDepartmentFilter: !showDepartmentFilter, filterName: '' }
        }
        case 'toggle-department-filter': {
            return {...state, showDepartmentFilter: !showDepartmentFilter}
        }

        case 'filter-name': {
            return {...state, filterName: filterName, showNameFilter: !showNameFilter}
        }
        case 'toggle-name-filter': {
            return {...state, showNameFilter: !showNameFilter}
        }
        case 'rerender' : {
            return {...state, rerender: state.rerender++}
        }
    }
    return;
}

function Reports() {

    // have no state for the filterName

    // have no state for the filterDepartmentName

    // make the filter only change the store???
    const aState : State = {rerender: 0, filterName: '',showNameFilter: false, showDepartmentFilter: false, filterDepartmentKey: 0, filterDepartmentName: "All Departments"};

    const filterDepartment = (key: number,name: string) => {
        dispatch({type: 'filter-department', filterDepartmentName: name, filterDepartmentKey:  key, filterName: ""});
    }

    const [state, dispatch] = useReducer(reducer, aState);

    const toggleDepartmentFilter = () => {
        dispatch({...state, type: 'toggle-department-filter'});
    }

    const toggleNameFilter = () => {
        dispatch({...state, type: 'toggle-name-filter'})
    }

    const filterName = (name : string) => {
        dispatch({...state, type: 'filter-name', filterName: name});
    }

    // conditionally assign the proper view
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const match: any = useRouteMatch();
    // const {settingsStore, employeeStore} = useContext(RootStoreContext);
const {employeeStore, settingsStore, departmentStore} = useStore();
  // const {employeeStore, settingsStore, departmentStore} = useContext(RootStoreContext);

const Departments = departmentStore.Departments;
  
/*MUST ONLY SHOW NAMES WITHIN THE DEPARTMENT SELECTED */
let employees: EmployeesModel = employeeStore.Employees;


if (state.filterDepartmentName !=="All Departments" ) {
    employees = employees.filter((employee: EmployeeModel)  => Departments[employee.fk_DepartmentId] === state.filterDepartmentName)
}
   const startDate = settingsStore.StartDate === 'default' ? '' :  settingsStore.StartDate;
   const endDate = settingsStore.EndDate === 'default' ? '' : settingsStore.EndDate;
    return (
        <>
        {/* Main bar at top */}
            <NavigationBar />

            <div  className={["card", "navGrid"].join(" ")} style={{ color:"#0B0DE6"}}>
                <div  style={{margin: "0.1rem 0px", textAlign: "center"}}>
                    <label id="firstLabel" style={{width:"5rem", margin: "0 auto"}}>Start Date</label>
                    <DateControl defaultDate={startDate} offset={true} mobxSetDate={settingsStore.setStartDate} />
                </div>

                <div style={{margin: "0.1rem 0px", textAlign: "center"}}>
                    <label id="firstLabel" style={{width:"5rem",margin: "0 auto"}}>End Date</label>
                    <DateControl defaultDate={endDate}  offset={true} mobxSetDate={settingsStore.setEndDate}/>
                </div>

                <FilterDepartmentButton show={state.showDepartmentFilter} setShow={toggleDepartmentFilter} filterDepartment={filterDepartment} selectedDepartment={settingsStore.SelectedDepartment} filterAble={departmentStore.Departments} label={"Department"} />

            {match?.params?.view === "employee" &&
                <FilterNameButton  label="Name" filterAble={employees} selectedName={settingsStore.SelectedEmployee} filterName={filterName} show={state.showNameFilter} setShow={toggleNameFilter} />

            }                     
            </div>
    <>   
    {match?.params?.view === "employees" && 
    
    <Employees StartDate={""} EndDate='' Department={state.filterDepartmentName}  Name="" />
    }

    {match?.params?.view === "employee" && 
    
    <Employee  EmployeeId={settingsStore.SelectedEmployeeId}  StartDate={settingsStore.StartDate} EndDate={settingsStore.EndDate} Department={state.filterDepartmentName}  Name={state.filterName} />
    }
        {/* <DisplayingTimesheets /> */}
    </>      
        </>
    )
}

export default observer(Reports);
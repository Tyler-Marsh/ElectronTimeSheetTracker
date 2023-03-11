import React, {useReducer} from 'react';
import NavigationBar from '../Navigation/NavigationBar';
import DateControl from '../DateControls/DateControl';
import FilterDepartmentButton from '../Reports/FilterDepartmentButton';
import FilterNameButton from '../Reports/FilterNameButton';
import {useStore} from '../../Stores/RootStore';
import {useRouteMatch } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import EmployeesModel from '../../Models/EmployeeModel';
import SummaryTable from './SummaryTable';
import Donation from '../Donate/Donation';


interface State {
  filterDepartmentName: string;
  filterDepartmentKey: number;
  showDepartmentFilter: boolean;
  showNameFilter: boolean;
  filterName: string;
  rerender: number;
}

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

function Summary() {
  
  // const {settingsStore, employeeStore} = useContext(RootStoreContext);
  const {settingsStore, departmentStore} = useStore();
 
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
                    <DateControl offset={true} defaultDate={endDate} mobxSetDate={settingsStore.setEndDate}/>
                </div>

                <FilterDepartmentButton show={state.showDepartmentFilter} setShow={toggleDepartmentFilter} filterDepartment={filterDepartment} selectedDepartment={state.filterDepartmentName} filterAble={departmentStore.Departments} label={"Department"} />
  
            </div>
                <div className="card" style={{width: "95%", margin: "1rem auto"}}>
                    <SummaryTable />
                    
                </div>
         <Donation />
</>   
  )
}

export default observer(Summary)
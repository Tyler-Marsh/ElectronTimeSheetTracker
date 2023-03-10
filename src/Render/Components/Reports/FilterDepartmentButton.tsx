import React, {useState, useContext} from 'react';
import {observer} from 'mobx-react-lite';
import FilterDepartmentInput from './FilterDepartmentInput';
import { RootStoreContext, useStore } from '../../Stores/RootStore';


interface Props {
  label: string;
  filterAble: any;
  selectedDepartment: string;
  filterDepartment: any;
  show: boolean;
  setShow: any;
}

interface State {
  selected: string;
  show: boolean;
}

/* TODO */
/* Take in the iterable object in props  */
/* This seems like a huge pain  */
/* Will need to specify if it is an object or an array for looping at the end?  *
/* Be able to pass a function that updates the parent component */
/* selection function that changes the text of the button */
/* filter feature that temporarily shows less of the options */
// const forRegex = "^" + state.filterName + ".+|" + state.filterName;
// const reg = new RegExp(forRegex, 'i');
// the input can contain its own state to filter
function FilterDepartmentButton(Props: Props) {
 
  
 const {settingsStore} = useContext(RootStoreContext);
 const aState : State = {selected: settingsStore.SelectedDepartment, show: false};
 const [state, setState] = useState(aState);


  return (
    <div style={{margin: "0.1rem 0px", textAlign: "center", position:"relative"}}>
      <label id="firstLabel" style={{width:"5rem",margin: "0 auto"}}>{Props.label}</label>
      <div>
          <button  onClick={() => {Props.setShow()}} className={["filterButtonInput", "dateInput"].join(" ")} style={{ backgroundColor: state.show ? "whitesmoke" : "#FFF",width: "100%", boxShadow: Props.show ? "inset 0 0 10px #909090" : "none"}}>
            <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
              <label>{Props.selectedDepartment}</label> 
              <label className="arrow"></label>
            </div>
          </button>
      </div>
      <FilterDepartmentInput filterDepartment={Props.filterDepartment} selected={settingsStore.SelectedDepartment} show={Props.show} hide={Props.setShow} filterAble={Props.filterAble} />
    </div>
  );
}

export default observer(FilterDepartmentButton);
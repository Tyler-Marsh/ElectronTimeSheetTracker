import React, {useState} from 'react';
import {observer} from 'mobx-react-lite';
import FilterNameInput from './FilterNameInput';


interface Props {
  label: string;
  filterAble: any;
  selectedName: string;
  filterName: any;
  show: boolean;
  setShow: any;
}

interface State {
  selected: string;
  show: boolean;
}
function FilterNameButton(Props: Props) {

// gonna have to figure out a work around
 const aState : State = {selected: "All Departments", show: false};
 const [state, setState] = useState(aState);

 let nameFound = false;
 Props.filterAble.forEach((person:any) => {
   if(person?.Name === Props.selectedName) {
     nameFound = true;
   }
 })

  let name = Props.selectedName;

 if (Props.selectedName === "" && Props.filterAble.length !== 0) {
   name = "Select a User";
 }
 if (Props.filterAble.length === 0) {
   name = "No available employees"
 }
 if (!nameFound) {
  name = "Select a User";
 }
 
  return (
    <div style={{margin: "0.1rem 0px", textAlign: "center", position:"relative"}}>
      <label id="firstLabel" style={{width:"5rem",margin: "0 auto"}}>{Props.label}</label>
      <div>
          <button  onClick={() => {Props.setShow()}} className={["filterButtonInput", "dateInput"].join(" ")} style={{ backgroundColor: state.show ? "whitesmoke" : "#FFF",width: "100%", boxShadow: Props.show ? "inset 0 0 10px #909090" : "none"}}>
            <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
              <label>{name}</label> 
              <label className="arrow"></label>
            </div>
          </button>
      </div>
      <FilterNameInput filterName={Props.filterName} selected={Props.selectedName} show={Props.show} hide={Props.setShow} filterAble={Props.filterAble} />
    </div>
  );
}

export default observer(FilterNameButton);
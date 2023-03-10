import React, {useEffect, useRef, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {useStore} from '../../Stores/RootStore';

interface Props {
  filterAble: any;
  show: boolean;
  hide: any;
  selected: string;
  filterDepartment: any;
}

function FilterDepartmentInput(Props: Props) {
  
  const {settingsStore} = useStore();

  let departments = Props.filterAble;
  const [input, setInput] = useState('');
  const forRegex = "^" + input + ".+|" + input;
  const reg = new RegExp(forRegex, 'i');

  if (input !== '') {
   departments = filterObj(departments);
  }

  function filterObj(obj: any) {
    const newObj : { [key: number]: string } = {};
    Object.keys(obj).forEach((key: string) => {
      if (reg.test(obj[key])) {
        newObj[parseInt(key)] = obj[key];
      }
    })
    return newObj;
  }

  const filterButtonRef: React.RefObject<HTMLDivElement> = useRef();
  useEffect(() => {
    document.addEventListener("mousedown", 
    (event: any) => { 
       if (filterButtonRef.current && !filterButtonRef?.current.contains(event.target)) {
         setInput("");
         Props.hide();
       }
   })
 });

 const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
   const value = e.currentTarget.value;
   setInput(value);
 }


 let message = "";
 if (Object.keys(departments).length === 0 && !reg.test("All Departments")) {
   message = "No matches found";
 }
 
  if (Props.show) {
    return (
      <div ref={filterButtonRef} className="card" style={{color: "black",borderRadius: "2px",border: "1px solid #E8E8E8",position: "absolute", width: "100%", backgroundColor: "white", marginTop: ".2rem"}}>
       <input onChange={(e) => {handleChange(e)}} className="filterInput">
       </input>
      
       { reg.test("All Departments") &&
       <div onClick={() => {settingsStore.setSelectedDepartment("All Departments", 0); Props.filterDepartment(0, "All Departments")}} className={Props.selected === "All Departments" ? "selectedRow" : "filterRow"}>
         <div className="listItemFilter">
           All Departments
         </div>
       </div>
      }
     
       {Object.keys(departments).map((keyName, i) => (
          <div onClick={() => {settingsStore.setSelectedDepartment(Props.filterAble[keyName], parseInt(keyName)); Props.filterDepartment(parseInt(keyName),Props.filterAble[keyName])}} className={Props.filterAble[keyName] === Props.selected ? "selectedRow" :"filterRow"} key={i}>
              <div className="listItemFilter">
                {Props.filterAble[keyName]}
              </div>
          </div>
        ))}
        <div className="listItemFilter" style={{cursor: "context-menu"}}>{message}</div>
      </div>
    )
  }
  return (
    <></>
  )
}

export default observer(FilterDepartmentInput);
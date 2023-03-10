import React, {useEffect, useRef, useState} from 'react';
import {observer} from 'mobx-react-lite';
import { EmployeeModel } from '../../Models/EmployeeModel';
import {useStore} from '../../Stores/RootStore';

interface Props {
  filterAble: any;
  show: boolean;
  hide: any;
  selected: string;
  filterName: any;
}

function FilterNameInput(Props: Props) {

  // useStore here
  
const {settingsStore} = useStore();
  
  let names = Props.filterAble;
  const [input, setInput] = useState('');
  const forRegex = "^" + input + ".+|" + input;
  const reg = new RegExp(forRegex, 'i');

  if (input !== '') {
   names = filterObj(names);
  }

  function filterObj(obj: Array<EmployeeModel | null>) {
    return obj.filter(word => reg.test(word?.Name));
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
 //if (names.length === 0 && !reg.test("All Departments")) {
 if (names.length === 0) {
   message = "No matches found";
 }

 
    if (Props.show === true) {
      return (
        <>
        <div ref={filterButtonRef} className="card" style={{color: "black",borderRadius: "2px",border: "1px solid #E8E8E8",position: "absolute", width: "100%", backgroundColor: "white", marginTop: ".2rem"}}>
          <input onChange={(e) => {handleChange(e)}} className="filterInput">
          </input>
          
               
       {names.map((name: EmployeeModel, i: number) => (
          <div key={i} onClick={() => {settingsStore.setSelectedEmployee(name.Name, name.pk_EmployeeId); Props.filterName(name.Name)}} className={name.Name === Props.selected ? "selectedRow" :"filterRow"} >
              <div className="listItemFilter">
                {name.Name}
              </div>
          </div> ))}
        <div className="listItemFilter" style={{cursor: "context-menu"}}>{message}</div>
        </div>
      </>
      )
    }
    return (
      <>
      </>
    )

}

export default observer(FilterNameInput);
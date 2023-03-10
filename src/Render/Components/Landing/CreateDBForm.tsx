import React, { ReactElement } from 'react';

//import { createInputFiles } from 'typescript';

/*
export interface ModalInput {
    FieldName: string;
    regexValidator: RegExp[];
    validationMessage: string[];
    error: boolean | null
}

export interface ModalInputs {
    inputs : ModalInput[] | null,
    onChange: any
}
*/

interface Props {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    handleSubmit: any;
    files: string[];
}


export default function CreateDBForm(Props : Props) : ReactElement {

    const inputs = {
        Name: "",
        errors: {
            Name: ""
        }
    }


  function handleSubmit(e: React.SyntheticEvent) {
      e.preventDefault();

      if (state.Name.trim() === "" ) {
          setState({...state, errors: {Name:'Enter a valid workspace name'}});
          return;
      }
      if (state.errors.Name !== "") {
          return;
      }
      if (Props.handleSubmit !== null) {

        console.log("CreateDBFORM line 48 HANDLING SUBMIT: "+ state.Name)


        Props.handleSubmit(state.Name);
      }
  }
    

  const [state, setState] = React.useState(inputs);
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fieldChange = (event: any) : void => {
     
    const { name, value } = event.target; 
    const errors = state.errors 
    const reg1 = new RegExp(/^[^*|":<>.,[\]{}`\\()';@&$]+$/g);
    switch(name) {
        case("Name"): 
        
        errors.Name = reg1.test(value) === true ? "" : "No special characters";
        if (value.length > 20 ) {
            errors.Name = "No more than 20 characters";
        }
        if (value === "") {
            errors.Name = "Please enter a name";
        }

        if (Props.files.find((val : string) => val === value + ".db") !== undefined) {
            errors.Name = "This workspace name is already taken."
        }
        break; 
    }
    
   
    setState(prevState => ({ ...prevState, [name]: value, errors: errors }));
  }
  
    return (
        <>
        <div style={{position: "relative", height: "2rem", marginTop: "0rem", width: "50%"}}>   
                    <div>
                        <input  maxLength={20} onChange={fieldChange} value={state.Name} name={"Name"} type="text" placeholder= " " tabIndex={-1} className="modalInput" style={{fontSize: "inherit",display: "inline-block", position: "absolute", top:"0rem", backgroundColor: "transparent", zIndex: 3, }} />
                        <label  className="modalLabel" style={{position: "absolute", top: "0rem", textAlign: "center", zIndex:2}}>
                            Name
                        </label>
                        <div  style={{backgroundColor: "white", zIndex: 1, top: "0rem", position: "absolute", height: "100%", width: "100%"}}>                
                        </div>
                        {  state.errors.Name !== "" &&                 
                        // isActive ? "app" : null
                            <label className={"formValidation" } style={{}}>
                                {state.errors.Name}    
                            </label>
                        }
                       
                  </div>                                  
        </div>

        <div style={{display: "flex", flexDirection: "row", marginTop: "1rem"}}> 
        </div> 


            <div style={{display: "flex", flexDirection: "row", marginTop: "1rem", justifyContent: "center"}}> 

            <div style={{display: "flex", justifyContent: "center"}}>
            
                <button className="landingButton" style={{marginTop: "0rem" }} onClick={handleSubmit} >Submit</button>
            
        </div>
        </div> 

        </>

    )
}
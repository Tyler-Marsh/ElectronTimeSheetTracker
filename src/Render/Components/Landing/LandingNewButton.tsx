import React, { ReactElement, useState} from 'react';
import LandingModal from './LandingModal';
import {ModalInputs, ModalInput} from '../../Models/ModalInputsModel';
// older version
//import {ipcRenderer} from 'electron';
// newer version electron
//const ipcRenderer = window.require("electron").ipcRenderer;

interface Props {
    ModalMessage: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    needFetch: any;
    files: string[];
}
export default function LandingNewButton(Props : Props) : ReactElement {
  
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const  fieldChange = (event : any) =>  {
        const { name, value } = event.target;
        setState(prevState => ({ ...prevState, [name]: value }));
    }

    const input1 : ModalInput = {
        FieldName: "Name",
        regexValidator: [new RegExp(/^[A-Za-z0-9]{1,20}/)],
        validationMessage: ["no special characters","less than 20 characters"],
        value: ""
    }

    const inputs : ModalInputs = {inputs: [input1], onChange: function(){console.log("hi")}};
    
    interface FormObject {
        [key: string]: string;
      }
       
    const formObject: FormObject = {};
      // type guarding
        
    inputs.inputs.forEach((element: ModalInput) => {
        formObject[element.FieldName]  = "";
        });
    
        // const [state, setState] = useState(formObject);
    const [, setState] = useState(formObject);

    const [message, setMessage] = useState("");
    
    

    inputs.onChange = fieldChange;

    //const [renderState, setRenderState] = useState(0);

    const [showModal, setShowModal] = useState(false);

    const handleSetShowModal = () : void => {
        setShowModal(true);
        
    }

    const handleCloseModal = () : void => {
        setShowModal(false);
        setMessage("");
        Props.needFetch();
    }

    
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const  CreateDB = async (state: any) => {
        const files = Props.files.map(element => element.split(".")[0]);

        try {
		if(files.find(element => element === state) === undefined) {
            const success : boolean = await  window.e_Landing.CreateDB(state) .then((value: boolean) => value);
			// const success : boolean = await  ipcRenderer.invoke('create-db', state).then((value: boolean) => value);
			if (success) {
				setMessage("Workspace successfully created!");
				return;
			} setMessage("Failed to create database");
            return;
		} 
       } catch(err) {
console.log("submitting new db name: "+ err);
       }
    }

    if (message === "") {
            return(
                <>
                    <div style={{display:"flex", justifyContent:"center", margin: "10px 0"}}>
                        <button className="landingButton" onClick={handleSetShowModal}>New</button>
                        <LandingModal show={showModal} hide={handleCloseModal} 
                            handleButton={CreateDB}
                            title={"Create new workspace"} resultMessage={Props.ModalMessage}
                            DBForm={true}
                            buttonText={""}
                            files={Props.files}
                            buttonMargin={null}
                        />
                    </div>
                </>
            );
    }
        
            return (
           
                <div style={{display:"flex", justifyContent:"center", margin: "10px 0"}}>
                    <button className="landingButton" onClick={handleSetShowModal}>New</button>
                    <LandingModal show={showModal} hide={handleCloseModal}
                            handleButton={handleCloseModal}
                            title={"Result"} resultMessage={message}                     
                            DBForm={false}
                            buttonText={"OK"}
                            files={Props.files}
                            buttonMargin={2}
                        /> 
                </div>
            );     
}

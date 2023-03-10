import React, { useReducer, useState } from 'react';
import WorkSpaceGridItem from './WorkSpaceGridItem';
import LandingNewButton from './LandingNewButton';
import LandingModal from './LandingModal';
//const ipcRenderer = window.require("electron").ipcRenderer;


interface Props {
    files: string[];
    ModalMessage: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    needFetch: any;
}

interface State {
    // ModalStep 1 or 2 out of 2
    ModalStep: number;
    Index: number | null;
    Result: string | null; 
    Type: string | null;
    Show: boolean;
}


function reducer(state : State, action: {type : string,  ModalStep: number, index: number | null, Result: string | null, Type: string | null}) {
	const { type, ModalStep, index , Result, Type} = action;
	switch(type) {
		case 'delete': 
			return {...state, ModalStep, Index: index, Result, Show: true, Type};
        case 'rename':
           return {...state,  ModalStep, Index: index, Result, Show: true, Type};
        case 'confirm':
            return {...state, ModalStep, Index: index, Result, Show: true}  
        case '': 
            return {...state, Type: null,  ModalStep: 0, Index: null, Result: null, Show: false};
		default:
            return {...state}
	}
}


// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function DbList(Props : Props)  {
    // ModalStep 1st or ModalStep modal
    // 
    const aState : State  = {
        ModalStep: 0,
        Index: null,
        Result: null,
        Type: null,
        Show: false
    }
    
    const [state, dispatch] = useReducer(reducer, aState)
  
    const [, setShowModal] = useState(false);

    const files = Props.files;

    const UpdateDB  = async (filename: string) => {

        let success = false;
        const oldName = Props.files[state.Index !== null ?  state.Index : 0 ];
        try {
            success = await  window.e_Landing.UpdateDB(oldName, filename)//.then((res: boolean) => res)
        }
        catch (err) {
            console.log(err, "@@ UpdateDB DbList catch");
        }

        if (success) {
            dispatch({type: 'confirm', ModalStep: 2, index: state.Index,  Result: "Workspace Renamed!", Type: "rename" })
        }
    }

    const DeleteDB = async () => {

        console.log(files, state.Index);
      
        if (state.Index !== null) {
            let success = false;
            try {
                success =  await window.e_Landing.DeleteDB(files[state.Index].split(".db")[0]);
            // success =  await ipcRenderer.invoke('delete-db', files[state.Index].split(".db")[0]);
            }
            catch (err) {
                console.log(err, "@@DeleteDB");
                
            }

            if (success) {
                let resultMessage : string
                if (state.Index !== null) {
                resultMessage  = "Successfully deleted: " + files[state.Index]
                } else {
                    resultMessage = "Successfully Deleted";
                }
             
                dispatch({type: 'confirm', ModalStep : 2, index: null, Result: resultMessage, Type: 'delete' })
                Props.needFetch(true);
                return;        
            }
            dispatch({type: 'confirm', ModalStep: 2, index: null, Result: "Something went wrong. The workspace wasn't deleted.", Type: 'delete'})
        }   
    }

    const handleCloseModal = () : void => {
        setShowModal(false);      
        Props.needFetch();
        dispatch({type: '', ModalStep: 0, index: null, Result: null, Type: null})
    }  
  
    let buttonText = 'Ok';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let handleButton : any = handleCloseModal;
    let resultMessage = "Are you sure you want to?"

    let title : string = state.Type === "rename" ? "Rename workspace" : "Delete workspace";

    if (state.Type === 'delete' && state.ModalStep === 1) {

        buttonText = "Yes";
        handleButton = DeleteDB;
        title = "Delete Workspace?";
        if (state.Index !== null && files !== null && files.length !== 0 && files[state?.Index] !== undefined) {
            console.log(files)
            resultMessage = files[state.Index].split(".db")[0];
        }     
    }

    if (state.Type === "rename" && state.ModalStep === 1) {
        handleButton = UpdateDB;
        title = "Rename  workspace";
        if (state.Index !== null) {
            title = "Rename Workspace? ";
            resultMessage = files[state.Index].split(".db")[0];
            console.log(files[state.Index]);
        }      
    }

   const HandleDeleteModal = (index: number) => {
        dispatch({type: 'delete', ModalStep: 1, index, Result: null, Type: 'delete'})
   }

   const HandleRenameModal = (index: number) => {
       dispatch({type: 'rename', ModalStep: 1, index, Result: null, Type: 'rename'})
   }

   const buttonMargin = state.ModalStep === 2 ? 2: 1;

    if (files !== undefined ) {
        return (        
            <>
                <LandingNewButton  files={Props.files} ModalMessage={Props.ModalMessage} needFetch={Props.needFetch} />
                <div className="landingGrid" >
                    {files.map((file, index) => (
                        <WorkSpaceGridItem key={index} index={index} file={file} handleDelete={HandleDeleteModal} handleRename={HandleRenameModal} />
                    )) }
                </div>
                {/* STATE TO CONDITIONALLY RENDER IF A MODAL SHOULD APPEAR? */}
                <LandingModal show={state.Show}  
                    hide={handleCloseModal}
                    buttonText={buttonText}
                    title={title}
                    resultMessage={state.Result === null ? resultMessage : state.Result}
                    handleButton={handleButton}
                    DBForm={state.ModalStep === 1 && state.Type === 'rename'}
                    files={Props.files}
                    buttonMargin={buttonMargin}

                />
            </>
        )
    } 

    
    return (<div></div>)
}
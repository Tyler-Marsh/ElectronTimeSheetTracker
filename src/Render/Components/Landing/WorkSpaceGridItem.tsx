import React, {useContext, useState, useEffect} from 'react';
import history from '../../Helpers/history';
import { RootStoreContext } from  '../../Stores/RootStore';
import { observer} from 'mobx-react-lite';

interface Props {
    file: string;
    index: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    handleRename: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    handleDelete: any;
}

  function WorkSpaceGridItem(Props: Props) {

    const [state, setState] = useState({loading: false, selectedDb: ''});

    useEffect(() => {
        if(state.loading === true) {
            let mounted = true;
            handleClick(state.selectedDb);
            return () => {
                mounted = false;
            }
        }
	}, [state.loading]);
  
    const {settingsStore} = useContext(RootStoreContext);

    const handleClick = async (selectedDb: string) : Promise<void> => {
        // init with the db name

        const result = await settingsStore.init(selectedDb);
        if (result){
            history.push("/main/employee");
        } else {
            console.log("ERROR @ handleClick WorkSpaceGridItem: " + result);
            setState({...state, loading: false})
        }
       
    }

    const setStateClick = (selectedDb: string): void => {
        setState({loading: true, selectedDb});
    }

    if (!state.loading) {
        return (    
        <div className="card" key={Props.index} style={{/*backgroundColor: "#f5f8fc",*/ backgroundColor: "rgb(0, 116, 217)", borderRadius: "2px", maxWidth: "100%", marginBottom: "1rem"}}>
            <p style={{wordWrap: "break-word", textAlign: "center", color: "white"}} >{Props.file.split(".")[0]}</p>
            <button onClick={() => {setStateClick(Props.file)}} className={["wsButton"].join(" ")} style={{display: "block", width:"90%", margin: "5px auto"}}>Manage</button>
            <button onClick={() => {Props.handleRename(Props.index)}} className={["wsButton"].join(" ")} style={{display: "block", width:"90%", margin: "5px auto"}}>Rename</button>
            <button onClick={() => {Props.handleDelete(Props.index)}} className={["wsButton"].join(" ")} style={{display: "block", width:"90%", margin: "0 auto 5px" }}>Delete</button>
        </div>
        )
    }

    return (
        <div className="card" key={Props.index} style={{/*backgroundColor: "#f5f8fc",*/ backgroundColor: "rgb(0, 116, 217)", borderRadius: "2px", maxWidth: "100%", marginBottom: "1rem"}}>
           <p>Loading</p>
        </div>
    )
}

export default observer(WorkSpaceGridItem);

import '../../Css/styles.css';
import React, { useEffect, useReducer} from 'react';
import history from "../../Helpers/history";
import DbList from './DbList';
import { observer} from 'mobx-react-lite';
import {useStore } from '../../Stores/RootStore';



interface State {
	loading: boolean;
	needFetch: boolean;
	modalMessage: string | null;
	files: string[];
}

function reducer(state: State, action: {type : string, payload : string[]}) {
	const { type, payload } = action;
	switch(type) {
		case 'need-fetch': 
			return {...state, needFetch: true, loading : true};
		case 'do-not-need-fetch':
			return {...state, needFetch: false, loading: false};	
		case 'successful-fetch':
			return {...state, needFetch: false, files: payload, loading: false};		
		default:
			return {...state}
	}
}

  function Landing() {

		const aState : State = {
			loading: true,
			needFetch: true,
			modalMessage: null,
			files: []
		}
	

	const [state, dispatch] = useReducer(reducer, aState);

	const NeedFetch = () => {
		dispatch({type: "need-fetch", payload: []})
	}

	const fetchDBs = async (): Promise<string[]> => {
		try {
			
			const files: string[] | [] = await window.e_Landing.GetDbs();
			const filteredFiles = files.filter(function(file) {
				return file.split('.')[1] !== 'json' && file.split('.')[1].toLowerCase() !== 'ds_store';
			});

			return filteredFiles;
		}
		catch(ex) {
			console.log(ex);
		}
		return [];
	
	}	

	useEffect(() => {
		
		let mounted = true;
		if (state.needFetch === true && mounted === true) {

			fetchDBs().then(files => {
				if (mounted) {
					dispatch({type: 'successful-fetch', payload: files});
				}
			})
				
		}
		// only run on mount && when needFetch changes
		return () => {
			mounted = false;
		}
	}, [state.needFetch]);

	return (
		
		<div className="card" style={{backgroundColor: "white", width: "80%", margin: "0 auto", borderRadius: "2px" }}>

			{ state.loading && <h2 className="landingHeader" style={{color: "#0074D9"}} >Loading...</h2>				
			}

			{ !state.loading && <h2 className="landingHeader"> </h2>

			}
			<h3 className="landingP" style={{color:  "#0074D9"}}>Select a workspace to manage <br></br> Or create a new workspace</h3>
			
			<DbList  needFetch={NeedFetch} files={state.files} ModalMessage={state.modalMessage === null ? '' : state.modalMessage} />
			
		</div>
	)	
}

export default observer(Landing);
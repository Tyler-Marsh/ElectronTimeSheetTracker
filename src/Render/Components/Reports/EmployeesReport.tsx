import React, {useEffect, useState, useReducer} from 'react';
import { observer} from 'mobx-react-lite';
import moment from 'moment';

interface Props {
 StartDate: string;
 EndDate: string;
 Department: string;
 Name: string;
}

interface State {
    needFetch: boolean;
    message: string;
    
}


function reducer(state: State, action: {type : string, message: string}) {
	const { type, message } = action;
	switch(type) {
		case 'start-date-greater-than-end': 
			return {...state, needFetch: false, message: "The shift start date shoulnd't be greater than the end date"};
		default:
			return {...state}
	}
}

// StateDate: string;
//  EndDate: string;
//  Department: string;
//  Name: string;

 function Employees(Props: Props) {

    // doesn't necessarily need state, maybe just
    // needs to have an update or something????
    const aState: State = {needFetch: false, message: ''};
    const [state, dispatch] = useReducer(reducer, aState);

	useEffect(() => {
		//  { loading: false, liked }
		let mounted = true;
        if (Props.StartDate.length !== 10 && Props.EndDate.length !== 10) {
            return 
        }   
        //moment('2010-10-20').isAfter('2010-10-19');
        if (moment(Props.EndDate, "MM/DD/YYYY") >= moment(Props.StartDate, "MM/DD/YYYY"))
		// only run on mount && when needFetch changes
		//
		return () => {
			mounted = false;
		}
	}, [state.needFetch]);

    return(
        <>
            <p style={{textAlign: "center", marginTop: "0rem"}}>Grouped employees</p>
        </>
    )
}

export default observer(Employees);
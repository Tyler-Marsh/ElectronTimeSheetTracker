import React from 'react';
import NavigationBar from '../Navigation/NavigationBar';
import MainContentSplit from '../Containers/MainContentSplit'
import AddRemoveEmployees from './AddRemoveEmployees';
import AddRemoveDepartments from './AddRemoveDepartments';
import {observer} from 'mobx-react-lite';
import Donation from '../Donate/Donation';

// active nav link in react

  function AddRemove() {

    return (
        <>
            <NavigationBar />
            <MainContentSplit left={AddRemoveEmployees} right={AddRemoveDepartments} />
            <Donation />
        </>
    )
}

export default observer(AddRemove);
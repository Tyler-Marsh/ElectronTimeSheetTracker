import React from "react";
import ReactDOM from "react-dom";
import Landing from "./Render/Components/Landing/Landing";
//import { RootStoreContext} from './stores/RootStore'
import { Router, Route } from "react-router-dom";
import Report from "./Render/Components/Reports/Reports";
import history from "./Render/Helpers/history";
import AddRemove from "./Render/Components/AddRemove/AddRemove";
import Summary from "./Render/Components/Summary/Summary";
import Settings from "./Render/Components/Settings/Settings";
import { RootStoreContext, aRootStore } from "./Render/Stores/RootStore";

// 	{/*<RootStoreContext.Provider value={rootStore}> */}
// {/*</RootStoreContext.Provider> */}
export default ReactDOM.render(
  <RootStoreContext.Provider value={aRootStore}>
    <Router history={history}>
      <Route component={Landing} exact path="/" />
      <Route component={Report} path="/main/:view" />
      <Route component={AddRemove} path="/addremove" />
      <Route component={Summary} path="/summary" />
      <Route component={Settings} path="/settings" />
    </Router>
  </RootStoreContext.Provider>,
  document.getElementById("root")
);

import SettingsStore from './SettingsStore';
import EmployeeStore from './EmployeeStore';
import { createContext, useContext } from 'react';
import DepartmentStore from './DepartmentStore';

export default class RootStore {

  settingsStore: SettingsStore
  employeeStore: EmployeeStore
  departmentStore: DepartmentStore

  constructor() {
    this.settingsStore = new SettingsStore(this);
    this.employeeStore = new EmployeeStore(this);
    this.departmentStore = new DepartmentStore(this);
  }

}
export const aRootStore = new RootStore();


export const RootStoreContext = createContext(aRootStore);


export function useStore() {
  return useContext(RootStoreContext)
}
import { makeAutoObservable } from 'mobx';
import { InitModel, SettingsJsonModel } from '../Models/InitModel';
import RootStore from './RootStore';
import DbResult from '../Models/DbResult';
import { isInitModel } from '../Helpers/TypeGuards'; 
import {ShiftModel} from '../Models/ShiftModel';


export default class SettingsStore {

  DBs: string[] | null = null;
  rootStore : RootStore;
  SelectedDb: string | null = "Hotel.db";
  StartDate: string | null = "";
  EndDate: string | null = ""
  SelectedDepartment: string | null = "All Departments";
  SelectedEmployee: string | null = "";
  SelectedEmployeeId: number | null  = 0;
  SelectedDepartmentId: number | null = 0;
  SettingsJSON: SettingsJsonModel | null = null;

  ShowDonation: boolean = true;
  
  Shifts: ShiftModel[] | [] = [];

  ReportsLoading = false;

  constructor(aRootStore: RootStore) {
    this.rootStore = aRootStore;
      makeAutoObservable(this);
  }


  selectDb = (selectedDb: string) : void =>  {
    this.SelectedDb = selectedDb;
  }


  /* TYPE PREDICATE checking to set up Init */
  /*changes must be */
  init = async (selectedDb: string) : Promise<boolean> => {
    this.SelectedDb = selectedDb;

    // Init model hold settings then change what is all retrieved
    
    const result : DbResult | InitModel = await window.e_Init.Init(selectedDb);
    if (isInitModel(result)) {
      if (this.rootStore.employeeStore) {
        this.rootStore.employeeStore.GetAll(result.Employees)
      }
      if (this.rootStore.departmentStore) {
        this.rootStore.departmentStore.setDepartments(result.Departments);
      }
      this.setSettingsJSON(result?.SettingsJson);
      
      return true;
    }
    return false;
  }

  resetDb = () : void => {
    this.SelectedDb = null;
  }
  // arrow function to bind it
 setDBs = (DataBases:  string[] | null) : void => {
    this.DBs = DataBases;
  }

  setStartDate = (date: string) : void => {
    //console.log("NEW START DATE:   " +date)
    this.StartDate = date;
  }

  setEndDate = (date: string) : void => {
  //  console.log("NEW END DATE:   " +date)
    this.EndDate = date;
  }

  setSelectedDepartment = (department: string, departmentId: number) : void  => {
    this.SelectedDepartment = department;
    this.SelectedDepartmentId = departmentId
  }

  setSelectedEmployee = (employee: string, employeeId: number) : void => {
    this.SelectedEmployee = employee;
    this.SelectedEmployeeId = employeeId
  }

  toggleLoadingReports = (bol : boolean) : void => {
    this.ReportsLoading = bol;
  }

  setShifts = (Shifts: ShiftModel[]) : void => {
    this.Shifts =Shifts;
  }

  setSettingsJSON = (settings: SettingsJsonModel) : void => {
    if (settings) {
      this.SettingsJSON = settings;
    }
  }

  setShowDonation = (show: boolean) : void => {
    this.ShowDonation = show;
  }

}
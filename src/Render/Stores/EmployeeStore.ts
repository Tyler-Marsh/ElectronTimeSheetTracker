import { makeAutoObservable } from "mobx";
//import DbResult from '../Models/DbResult';
//import DbSingleResult from '../Models/DbSingleResult';
import EmployeesModel, { EmployeeModel } from "../Models/EmployeeModel";
import RootStore from "./RootStore";

export default class EmployeeStore {
  rootStore: RootStore;
  // make it null
  Employees: EmployeesModel = [];

  constructor(aRootStore: RootStore) {
    this.rootStore = aRootStore;
    makeAutoObservable(this);
  }
  // arrow function to bind it

  LogDb(): void {
    if (this.rootStore.settingsStore) {
      console.log(
        "Hello FROM Employee store \n",
        this.rootStore.settingsStore.SelectedDb
      );
    }
  }

  GetAll(Employees: EmployeesModel): void {
    this.Employees = Employees;
  }

  EditEmployee(Employee: EmployeeModel): void {
    const indexNum = this.Employees.findIndex(
      (emp: EmployeeModel) => emp.pk_EmployeeId === Employee.pk_EmployeeId
    );
    this.Employees[indexNum] = Employee;
    return;
  }

  DeleteEmployee(Employee: EmployeeModel): void {
    const indexNum = this.Employees.findIndex(
      (emp: EmployeeModel) => emp.pk_EmployeeId === Employee.pk_EmployeeId
    );
    this.Employees.splice(indexNum);

    // Find the index of the array element you want to remove using indexOf, and then remove that index with splice.
  }

  AddEmployee(Employee: EmployeeModel): void {
    this.Employees.push(Employee);
  }
}

import { makeAutoObservable } from "mobx";
//import DbResult from '../Models/DbResult';
//import DbSingleResult from '../Models/DbSingleResult';
import DepartmentsModel, { DepartmentModel } from "../Models/DepartmentModel";
import RootStore from "./RootStore";

interface DepartmentKey {
  [key: number]: string | null;
}

export default class DepartmentStore {
  rootStore: RootStore;
  // make it null
  Departments: DepartmentKey = {};

  constructor(aRootStore: RootStore) {
    this.rootStore = aRootStore;
    makeAutoObservable(this);
  }
  // arrow function to bind it
  setDepartments(Departments: DepartmentsModel): void {
    for (let i = 0; i < Departments.length; i++) {
      this.Departments[Departments[i].pk_DepartmentId] = Departments[i].Name;
    }
    if (Departments.length === 0) {
      this.Departments = {};
    }
    return;
  }

  AddDepartment(Deparment: DepartmentModel): void {
    this.Departments[Deparment.pk_DepartmentId] = Deparment.Name;
    return;
  }

  EditDepartment(Department: DepartmentModel): void {
    this.Departments[Department.pk_DepartmentId] = Department.Name;
  }

  DeleteDepartment(Department: DepartmentModel): void {
    delete this.Departments[Department.pk_DepartmentId];
    if (this.rootStore.employeeStore) {
      this.rootStore.employeeStore.Employees.forEach((employee) => {
        if (employee.fk_DepartmentId === Department.pk_DepartmentId) {
          employee.fk_DepartmentId = null;
        }
      });
    }
  }
}

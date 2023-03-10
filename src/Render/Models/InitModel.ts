import DepartmentsModel  from "./DepartmentModel";
import {EmployeesModel}  from "./EmployeeModel";

export interface SettingsJsonModel {
    payPeriodStartDate : number;
    rounding: string;
}
export interface InitModel 
{
    Departments: DepartmentsModel;
    Employees: EmployeesModel;
    SettingsJson?: SettingsJsonModel;
}
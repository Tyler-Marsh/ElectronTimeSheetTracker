//import DbResult from './Render/Models/DbResult';
import DbResult from './Render/Models/DbResult';
import DbSingleResult from './Render/Models/DbSingleResult';
import { DepartmentModel } from './Render/Models/DepartmentModel';
//import EmployeesModel, { EmployeeModel } from './Render/Models/EmployeeModel';
import { EmployeeModel } from './Render/Models/EmployeeModel';
import { InitModel } from './Render/Models/InitModel';
import {ShiftModel} from './Render/Models/ShiftModel';
import {ApiResult} from './Render/Models/ApiResult';
import { SummaryObject } from './Render/Models/SummaryShift';

export interface e_Landing {
    async GetDbs:  () => Promise<string[] | []>;
    async UpdateDB: (oldName: string, filename: string) => Promise<boolean>;
    async DeleteDB: (filename: string) => Promise<boolean>;
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async CreateDB: (state: any) => Promise<boolean>;
   }

export interface e_AddRemove {
    async AddEmployee: (dbName: string, Employee: EmployeeModel) => Promise<DbSingleResult>;
    async EditEmployee: (dbName: string, Employee: EmployeeModel) => Promise<DbSingleResult>;
    async DeleteEmployee: (dbName: string, Employee: EmployeeModel) => Promise<DbSingleResult>;
    async AddDepartment: (dbName: string, Department: DepartmentModel) => Promise<DbSingleResult>;
    async EditDepartment: (dbName: string, Department: DepartmentModel) => Promise<DbSingleResult>;
    async DeleteDepartment: (dbName: string, Department: DepartmentModel) => Promise<DbSingleResult>;
}

export interface e_Init {
    async Init: (dbName: string) => Promise<InitModel | DbResult>;
}


export interface e_Shift {
    async AddShift: (dbName: string, Shift: ShiftModel) => Promise<DbSingleResult>
    async GetSingleShifts: (dbName: string, start: string, end: string, employeeId: number) => Promise<ApiResult<ShiftModel[]>>
    async EditShift: (dbName: string, Shift: ShiftModel) => Promise<DbSingleResult>
    async DeleteShift: (dbName: string, ShiftId: number) => Promise<DbSingleResult>
    async GetSummaryShifts:(dbName:string,Start: string, End:string, Department: string, DepartmentId: number)=> Promise<ApiResult<SummaryShift[]>>
}

export interface e_Summary {
    async DownloadSummary:(SummaryObject: SummaryObject, format:string, start: string, end: string)  => Promise<any>
}

export interface e_Settings {
    async ChangeSettings:(dbName: string, SettingsJson: SettingsJsonModel) => Promise<DbResult>
}

declare global {
    interface Window {
    e_Landing: e_Landing;
    e_AddRemove: e_AddRemove;
    e_Init: e_Init;
    e_Shift: e_Shift;
    e_Summary: e_Summary;
    e_Settings: e_Settings;
    }
}
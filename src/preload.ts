import { contextBridge, ipcRenderer } from 'electron';
import DbResult from './Render/Models/DbResult';
import DbSingleResult from './Render/Models/DbSingleResult';
import { DepartmentModel } from './Render/Models/DepartmentModel';
import { EmployeeModel } from './Render/Models/EmployeeModel';
import { InitModel, SettingsJsonModel } from './Render/Models/InitModel';
import {ShiftModel} from './Render/Models/ShiftModel';
import {Result} from './Render/Models/Result';
import {ApiResult} from './Render/Models/ApiResult';
import OrderedShifts from './Render/Models/OrderedShifts';
import {SummaryObject, SummaryShift} from './Render/Models/SummaryShift';

/*LANDING PAGE*/
contextBridge.exposeInMainWorld('e_Landing', {
 
 GetDbs: async function() : Promise<string[] | []> 
  { 
    const dbs = await ipcRenderer.invoke('asynchronous-get-DBs')
    return dbs;
  },

    UpdateDB: async function(oldName: string, filename: string) : Promise<boolean> 
    {
      const result : boolean =  await ipcRenderer.invoke('rename-db', [oldName, filename]);
      return result;
    },

    DeleteDB: async function(filename: string) : Promise<boolean> 
    {
      const result : boolean  =  await ipcRenderer.invoke('delete-db', filename);
      return result;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    CreateDB: async function(state: any) : Promise<boolean>
    {
      const result : boolean = await ipcRenderer.invoke('create-db', state).then((value: boolean) => value);
      return result;
    }  
});

/*ADD REMOVE PAGE*/
contextBridge.exposeInMainWorld('e_AddRemove', {
    AddEmployee: async function(dbName: string, Employee: EmployeeModel) : Promise<DbSingleResult> {
      try {
        const result : DbSingleResult = await ipcRenderer.invoke('add-employee', {dbName, Employee});
        return result;
      }
      catch (err) {
        console.log("e_AddRemove AddEmployee: \n" + err);
        return {success: false, message: "Failed to add an employee", rowId: 0 }
      }    
    },

    EditEmployee: async function(dbName: string, Employee: EmployeeModel) : Promise<DbSingleResult> {
      try {
        const result : DbSingleResult = await ipcRenderer.invoke('edit-employee', {dbName, Employee});
        return result;
      }
      catch(err) {
        console.log("e_AddRemove: EditEmployee \n" + err);
        return {success: false, message: "Failed to edit an employee", rowId: 0 };
      }
    },

    DeleteEmployee: async function(dbName: string, Employee: EmployeeModel) : Promise<DbSingleResult> {
      try {
        const result : DbSingleResult = await ipcRenderer.invoke('delete-employee', {dbName, Employee});
        return result;
      }
      catch(err) {
        return {success: false, message: "Failed to delete an employee", rowId: 0};
      }
    },

    AddDepartment: async function(dbName: string, Department: DepartmentModel) : Promise<DbSingleResult>{
      try {
        const result : DbSingleResult = await ipcRenderer.invoke('add-department', {dbName, Department});
        return result;
      }
      catch(err) {
        return {success: false, message: "Failed to add the department", rowId: 0};
      }
    },

    EditDepartment: async function(dbName: string, Department: DepartmentModel) : Promise<DbSingleResult> {
      try {
        const result : DbSingleResult = await ipcRenderer.invoke('edit-department', {dbName, Department});
        return result;
      }
      catch(err) {
        return {success: false, message: "Failed to edit the department", rowId: 0};
      }
    },

    DeleteDepartment: async function(dbName: string, Department: DepartmentModel) : Promise<DbSingleResult> {
      try {
        const result: DbSingleResult = await ipcRenderer.invoke('delete-department', {dbName, Department});
        return result;
      }
      catch(err) {
        return {success: false, message: "Failed to delete the department", rowId: 0}
      }
    }
});

/*INITIALIZING*/
contextBridge.exposeInMainWorld('e_Init', {
  Init: async function(dbName: string) : Promise<InitModel | DbResult> {
    try {
      const init : InitModel = await ipcRenderer.invoke('init', dbName);
      return init;
    }
    catch(err) {
      console.log("e_Init failed \n" + err);
      return {success: false, message:"Something went wrong \n" + err }
    }
  }
});


// IS NOT A FUNCTION ERROR
contextBridge.exposeInMainWorld('e_Shift', {
  AddShift: async function(dbName:string, Shift: ShiftModel): Promise<DbSingleResult> {
    try {
      const result : DbSingleResult = await ipcRenderer.invoke('add-shift', {dbName, Shift});
      return result;
   }
   catch(err) {
    
     console.log(err);
     return {success: false, message: "Failed to add a shift", rowId: 0}
   }
  },
  // .GetSingleShifts(settingsStore.SelectedDb,StartDate, EndDate, Props.EmployeeId)
  GetSingleShifts: async function(dbName:string,StartDate: string, EndDate: string, EmployeeId: number ): Promise<ApiResult<ShiftModel[]>> {
    try {
      const result : ApiResult<ShiftModel[]>= await ipcRenderer.invoke('get-single-shifts', {dbName, StartDate, EndDate, EmployeeId});
      return result;
    }
    catch(err) {
      console.log(err);
      const result: ApiResult<ShiftModel[]> = new ApiResult<any>(false, [err], []);
      return result;
    }
  },

  EditShift: async function(dbName: string, Shift:ShiftModel): Promise<DbSingleResult> {
    try {
      const result: DbSingleResult = await ipcRenderer.invoke('edit-shift', {dbName, Shift});
      return result;
    }
    catch(err) {
      console.log(err);
      return {rowId:0, success:false, message:err};
    }
  },

  DeleteShift: async function(dbName: string, ShiftId: number): Promise<DbSingleResult> {
    try {
      const result : DbSingleResult = await ipcRenderer.invoke('delete-shift', {dbName, ShiftId});
      return result;
    }
    catch(err) {
      console.log(err);
      return {rowId: 0, success: false, message: err}
    }
  },

  // {dbName: string, Start:string, End: string, Department: string, DepartmentId: number }):  ApiResult<SummaryShift[]> => {
    GetSummaryShifts: async function(dbName:string,Start: string, End:string, Department: string, DepartmentId: number) :Promise<ApiResult<SummaryShift[]>>  {
      try {
        const result: ApiResult<SummaryShift[]> = await ipcRenderer.invoke('get-summary-shifts', {dbName,Start, End, Department, DepartmentId})
        return result;
      }
      catch(err) {
        console.log(err);
        const result: ApiResult<SummaryShift[]> = new ApiResult<any>(false, [err], []);
        return result;
      }
    }
  
});

contextBridge.exposeInMainWorld('e_Summary', {
  DownloadSummary: async function(SummaryObject: SummaryObject, format: string, start: string, end: string): Promise<DbResult> {
    try {
      const result: DbResult = await ipcRenderer.invoke('download', {SummaryObject, format, start, end});
      return result;
    }
    catch(err) {
      console.log("ERROR AT DOWNLOAD SUMMARY: "+ err)
      return {success:false, message: err}
    }
  },

})
//{payPeriodStartDate:initialPayPeriod, rounding: initialRounding}
contextBridge.exposeInMainWorld('e_Settings', {
  ChangeSettings: async function (dbName:string ,SettingsJson: SettingsJsonModel) : Promise<DbResult> {
    try {
      const result : DbResult = await ipcRenderer.invoke('change-settings',{dbName, SettingsJson});
      return result;
    }
    catch(err) {
      console.log("ERROR AT e_Settings: "+ err);
      return {success: false, message: err};
    }

  }
})
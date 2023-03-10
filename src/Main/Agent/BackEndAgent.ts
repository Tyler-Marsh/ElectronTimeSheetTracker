// // Modules to control application life and create native browser window
// import EmployeesModel, {EmployeeModel} from '../src/Components/models/EmployeeModel';
// import DepartmentsModel, {DepartmentModel} from '../src/Components/models/DepartmentModel'
// import DbResult from '../src/Components/models/DbResult';
// import { sqlite3 } from '../../../../AppData/Local/Microsoft/TypeScript/4.3/node_modules/@types/sqlite3';
// const sqlite3 = require('sqlite3').verbose();


// class Departments {

//     async add(Department: DepartmentModel, db: any): Promise<DbResult> {
//         let result: DbResult;
        
//         await db.run("INSERT INTO Department (Name), VALUES (?)", [Department.Name], (err) => {
//             if (err) {
//                 console.log("Department.add() failed \n " + err);
//                 result = {success: false, message: `Department.add() failed \n ${err}`};
//             }
//             else {
//                 result = {success: true, message: `Department successfully added`};
//             }
//         })
//         return result;
//     }

//     async getAll(db: any) : Promise<DepartmentsModel | null> {

//         let Departments: DepartmentsModel = [];
       
//           await  db.all(`SELECT * FROM Department ORDER BY Name`, [], (err, rows: [{pk_DepartmentId: number, Name: string}]) => {
//                     if (err) {
//                         console.log(`Employess.getAll() failed \n ${err}`)
//                         return;
//                     }
                  
//                     rows.forEach((row) => {
//                         Departments.push({Id: row.pk_DepartmentId, Name: row.Name});
//                     })
//                 }) 
//         return Departments;
//     }

//     async Update(Department: DepartmentModel, db: any) : Promise<DbResult> {
//         let result : DbResult;
//         await db.run("UPDATE Department SET Name = ? WHERE pk_DepartmentId = ?", [Department.Name, Department.Id], (err, res) => {
//             if (err) {
//                 result = {success: false, message: `Department.add() failed \n ${err}`};
//             } else {
//                 result ={success: true, message: "Successfuly updated Deparment"};
//             }
//         })

//         return result;
//     }

//     async Delete(Department: DepartmentModel, db: any) : Promise<DbResult> {
//         let result: DbResult;

//         await db.run("DELETE FROM Department WHERE pk_DepartmentId = ?", [Department.Id], (err, res) => {
//             if (err) {
//                 result =   {success: false, message: `Department.delete() failed \n ${err}`};
//             }
//             else {
//                 result ={success: true, message: "Successfuly deleted Deparment"};
//             }
//         })
//         return result;
//     }
// }

// class Employees {

//     async add(Employee: EmployeeModel, db: any) : Promise<DbResult> {
    
//             // returns only the database object to allow chaining of functions
//             // or methods
//             let result: DbResult;
//                await db.run(`INSERT INTO Employee (Name, fk_DepartmentId)` +
//               // `VALUES (${Employee.Name}, ${Employee.DepartmentId})`
//                `VALUES (?, ?)`, [Employee.Name, Employee.DepartmentId], (err) => {
//                     if (err) {
//                       console.log("Employees.add() failed \n" + err);
//                       result = {success: false, message: `Employees.add() failed \n ${err}`};
//                     } else{
//                         result = {success: true, message: "Successfuly added employee"};
//                     }
                    
//                })
//             return result;
//     }

//      async getAll(db: any) : Promise<EmployeesModel | null | DbResult> {

//         let Employees: EmployeesModel = [];
       
//                 db.all(`SELECT * FROM Employee ORDER BY Name`, [], (err, rows: [{pk_EmployeeId: number, Name: string, fk_DepartmentId: number | null}]) => {
//                     if (err) {
//                         console.log(`Employees.getAll() failed \n ${err}`)
//                     }
//                     rows.forEach((row) => {
//                         Employees.push({Id: row.pk_EmployeeId, Name: row.Name, DepartmentId: row.fk_DepartmentId });
//                     })
//                     // will be an issue if it's empty?
//                 })
//         return Employees;
//     }

//     async Update(Employee: EmployeeModel, db: any) : Promise<DbResult> {

//         let result: DbResult;
//       await  db.run(`UPDATE Employee SET Name = ?, fk_DepartmentId = ? WHERE pk_EmployeeId = ?`,
//          [Employee.Name, Employee.DepartmentId, Employee.Id], (err) => {
//             if (err) {
//                 result =  {success: false, message: `Employees.Update() failed \n ${err}`}
//                 console.log("Employee.Delete() failed. \n" + err);
//             }
//             else {
//                 result = {success: true, message: `Employee updated! \n ${err}`}
//             }      
//         });
//         return result;
//     }

//      async Delete(Employee: EmployeeModel, db: any): Promise<DbResult> {
//          let result : DbResult;
//         await db.run("DELETE FROM Employee WHERE pk_EmployeeId = ?", [Employee.Id], (err)=> {
//             if (err) {
//                 result =  {success: false, message: `Employees.Delete() failed \n ${err}`}
//                 console.log("Employee.Delete() failed. \n" + err);
//             }
//             else {
//                 result = {success: true, message: `Employee deleted! \n ${err}`}
//             }      
//         })
//         return result;
//     }
// }

// //module.exports = class BackEndAgent {

// class BackEndAgent {

//     public  Employees: Employees;
//     public Departments: Departments;
//     private  dbPath: string;
//     private  db: any;
 
//     constructor(dbPath: string) {
//         this.Employees = new Employees();
//         this.Departments = new Departments();
//         this.dbPath = dbPath;
//         this.init();
//     }

//     private async init() : Promise<void> {            
//         return new Promise((resolve, reject) => {
//             this.db = new sqlite3.Database(this.dbPath, (err) => {
//                 if (err) {
//                     console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ \n CANNOT CONNECT")
//                     console.log(this.db + "\n " + err.message);
//                     this.db.close();
//                     throw new Error(err);        
//                 }
//             })
//             resolve();
//         });
//     }

//     public CloseDB() : void {
//         this.db.close();
//     }

//     public async GetDepartments() :Promise<DepartmentsModel | null> {
//         let Departments : DepartmentsModel | null = await this.Departments.getAll(this.db);
//         return Departments;
//     }

//     public async UpdateDepartment(Department: DepartmentModel) : Promise<DbResult> {
//         let result : DbResult = await this.Departments.Update(Department, this.db);
//         return result;
//     }

//     public async DeleteDepartment(Department: DepartmentModel) : Promise<DbResult> {
//         let result: DbResult = await this.Departments.Delete(Department, this.db);
//         return result;
//     }

//     public async AddDepartment(Department: DepartmentModel) : Promise<DbResult> {
//         let result : DbResult = await this.Departments.add(Department, this.db);
//         return result;
//     }

//     public async  AddEmployee(Employee: EmployeeModel) : Promise<DbResult> {
//             let result: DbResult = await this.Employees.add(Employee, this.db);
//             return result;    
//     }

//    public async GetEmployees() : Promise<DbResult | EmployeesModel> {
//        let result : DbResult | EmployeesModel = await this.Employees.getAll(this.db);
//        return result;
//     }

//     public async DeleteEmployee(Employee: EmployeeModel) : Promise<DbResult> {
//         let result : DbResult = await this.Employees.Delete(Employee, this.db);
//         return result;
//     }

//     public async UpdateEmployee(Employee: EmployeeModel) : Promise<DbResult> {
//         let result : DbResult = await this.Employees.Update(Employee, this.db);
//         return result;
//     }

// }

// export default BackEndAgent;
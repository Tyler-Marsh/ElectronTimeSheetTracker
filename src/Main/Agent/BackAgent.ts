
import bs3 from 'better-sqlite3'
import {EmployeeModel, EmployeesModel} from '../../Render/Models/EmployeeModel';
import DbResult from '../../Render/Models/DbResult';
import DbSingleResult from '../../Render/Models/DbSingleResult';
import DepartmentsModel, {DepartmentModel} from '../../Render/Models/DepartmentModel';
import {ShiftModel} from '../../Render/Models/ShiftModel';
import {Result} from '../../Render/Models/Result'
import {SummaryShift} from '../../Render/Models/SummaryShift';

class Employee {
    Add(Employee : EmployeeModel, db : bs3.Database ) : DbSingleResult {
        try {
            const stmt = db.prepare(`INSERT INTO Employee (Name, fk_DepartmentId, DeleteIndicator) VALUES (?,?,?)`);
            const info = stmt.run(Employee.Name, null, Employee.DeleteIndicator);
            if (info.changes === 1) {
                const int  = info.lastInsertRowid.toString();

                return {success: true, message: "Successfully added an employee", rowId: parseInt(int)}
            } 
        }
        catch (err) {
            console.log(`Error at Employee.Add() \n ${err}`);
            return {success: false, message: `Failed @ Employee.Add() ${err}`, rowId: 0}
        }   
    }


    Edit(Employee: EmployeeModel, db: bs3.Database) : DbSingleResult
    {
        try {
            const stmt = db.prepare(`UPDATE Employee SET Name = ?, fk_DepartmentID = ?, DeleteIndicator = ? WHERE pk_EmployeeId = ?`);
            const info = stmt.run(Employee.Name, Employee.fk_DepartmentId, Employee.DeleteIndicator, Employee.pk_EmployeeId);
            if (info.changes ===1) {
                const int = info.lastInsertRowid.toString();
                return {success: true, message: "Successfully changed employee info", rowId: parseInt(int)};

            }
        }
        catch (err) {
            console.log(`Error at Employee.Edit() \n ${err}`);
            return {success: false, message: `Failed @ Employee.Edit() ${err}`, rowId: 0}
        }

    }

    Delete(Employee: EmployeeModel, db: bs3.Database) :DbSingleResult {
        try {
            const stmt = db.prepare("DELETE FROM Employee WHERE pk_EmployeeId = ?");
            const info = stmt.run(Employee.pk_EmployeeId);
            if (info.changes ===1) {
                const int = info.lastInsertRowid.toString();
                return {success: true, message: "Successfully deleted employee", rowId: parseInt(int)};
            }
        }
        catch (err) {
            console.log(`Errort at Employee.Delete() \n ${err}`);
            return {success: false, message: `Failed @ Employee.delete ${err}`, rowId: 0};
        }
    }

    GetAll(db: bs3.Database) : EmployeesModel | [] | DbResult {
        try {
            const stmt = db.prepare("SELECT * FROM Employee");
            const Employees : EmployeesModel = stmt.all();
            return Employees;
        }
        catch (err) {
            console.log(`Error at Employee.GetAll() \n ${err}`);
            return {success : false, message: "Failed to get all employees \n" + err};
        }
    }
}

class Department {


    Add (db: bs3.Database,Department: DepartmentModel) : DbSingleResult {

        try {
            const stmt = db.prepare("INSERT INTO Department(Name) VALUES (?)");
            const info = stmt.run(Department.Name);
            if (info.changes === 1) {
                const int = info.lastInsertRowid.toString();
                return {success: true, message: "Successfully added the department", rowId: parseInt(int)};
            }
        }
        
        catch (err) {
                console.log("Error at Department.Add() \n " + err);
                return {success: false, message: "Failed to add the department", rowId: 0};
            }
    }
    
    Edit(db: bs3.Database,Department: DepartmentModel): DbSingleResult {
        try {
            const stmt = db.prepare("UPDATE  Department SET Name = ? WHERE pk_DepartmentId = ?");
            const info = stmt.run(Department.Name, Department.pk_DepartmentId);
            if (info.changes === 1) {
                const int = info.lastInsertRowid.toString();
                return {success: true, message: "Successfully edited the department", rowId: parseInt(int)};
            }
        }
        
        catch (err) {
                console.log("Error at Department.Edit() \n " + err);
                return {success: false, message: "Failed to eddit the department", rowId: 0};
            }
    }

    Delete(db: bs3.Database, Department: DepartmentModel) : DbSingleResult {
        try {

            const setNull =  db.prepare("UPDATE Employee SET fk_DepartmentId = null WHERE fk_DepartmentId = ?");
            const deleteDepartment = db.prepare("DELETE FROM Department WHERE pk_DepartmentId = ?");

            const transaction = db.transaction((Department :DepartmentModel) => {
                setNull.run(Department.pk_DepartmentId);
                deleteDepartment.run(Department.pk_DepartmentId);
            });

            transaction(Department);
                return {success: true, message: "Successfully deleted the department", rowId: Department.pk_DepartmentId}; 
        }
        catch (err) {
            console.log(`Error at Department.Delete() \n ${err}`);
            return {success: false, message: "Failed to delete the department \n " + err, rowId: 0};
        }
    }

    GetAll (db: bs3.Database) : DepartmentsModel | DbResult {

        try {
            const stmt = db.prepare("SELECT * FROM Department");
            const Departments : DepartmentsModel = stmt.all();
            return Departments;
        }
        catch (err) {
            console.log(`Error at Department.GetAll() \n ${err}`);
            return {success : false, message: "Failed to get all departments \n" + err};
        }

    }
}

class Shift {

    Add(db: bs3.Database, Shift: ShiftModel) : DbSingleResult {
        try {
            
           // const stmt = db.prepare("INSERT INTO Department(Name) VALUES (?)");
           // const info = stmt.run(Department.Name);
            const stmt = db.prepare(`INSERT INTO Shift(Start, End, fk_EmployeeId,Comments, Extra, BreakTime) VALUES (?,?,?,?,?,?)`);
            const info = stmt.run(Shift.Start, Shift.End, Shift.fk_EmployeeId, Shift.Comments, Shift.Extra, Shift.BreakTime);
            if (info.changes === 1) {
                const int  = info.lastInsertRowid.toString();
                return {success: true, message: "Successfully added the shift", rowId: parseInt(int)}
            }        
        }
        catch(err) {
            console.log(`Error at Shift.Add() \n ${err}`);
            return {success: false, message: `Failed @ ShiftAdd() ${err}`, rowId: 0}
        }
    }

    GetShiftsSingleByDate(db: bs3.Database, start: string, end:string, employeeId: number): Result<ShiftModel[]> {

        try {
            console.log(`SELECT * FROM Shift WHERE Start >= ${start} AND Start <= ${end} AND fk_EmployeeID = ${employeeId}`)
         
            const stmt1 =  db.prepare("SELECT * FROM Shift WHERE Start >= ? AND Start <= ? AND fk_EmployeeID = ? ORDER BY Start ASC");
            const shifts = stmt1.all(start, end, employeeId);
         
            const result : Result<ShiftModel[]> = Result.ok(shifts);

            result.getValue().forEach((shift) => {
                console.log("SHIFT ID: "+ shift.pk_ShiftId + " BREAK: "+ shift.BreakTime);
            })
            return result;
        }
        catch(err) {
            console.log(`Failed @ Shift.SingleEmployeeByDate ${err}`);
            const result : Result<ShiftModel[]> = Result.fail([err]);
            return result;
        }
    }

    Edit(db: bs3.Database, Shift: ShiftModel) : DbSingleResult {

        try {
            const stmt = db.prepare("UPDATE Shift SET Start = ?, End = ?,Comments = ?, Extra = ?, BreakTime = ?  WHERE pk_ShiftId = ?")
            const info = stmt.run(Shift.Start, Shift.End, Shift.Comments, Shift.Extra, Shift.BreakTime,Shift.pk_ShiftId);
            if (info.changes === 1) {
                const result : DbSingleResult= {rowId: 0, success: true, message: 'Successfully updated the shift'}
                return result;
            }
            return {rowId: 0, success: false, message:"Something went wrong."}
        }

        catch(err) {
            console.log(`Failed @ Shift.Edit ${err}`);
            return {rowId: 0, success: false, message: err}
        }
    }

    Delete(db: bs3.Database, ShiftId: number) : DbSingleResult {

        try {
            const stmt = db.prepare("DELETE FROM SHIFT WHERE pk_ShiftId = ?");
            const info = stmt.run(ShiftId);
            if (info.changes ===1) {
                return {rowId: 0, success: true, message: "Successfully deleted the shift"};
            }
            return {rowId: 0, success: false, message: "Failed to delete the shift"};
        }
        catch(err) {
            console.log(`Failed @ Shift.Delete ${err}`);
        }

    }

    GetSummaryShifts(db: bs3.Database, Start:string, End: string, Department: string, DepartmentId: number) : Result<SummaryShift[]> {   

        // just two clauses if and else for if the Department is all vs if it is any

        if (DepartmentId === 0) {

            
            const sql = "SELECT Employee.Name, Employee.fk_DepartmentId, Employee.pk_EmployeeId, SHIFT.Start, SHIFT.End, SHIFT.BreakTime, SHIFT.Extra FROM SHIFT JOIN " +
                  "EMPLOYEE ON SHIFT.fk_EmployeeId = EMPLOYEE.pk_EmployeeId " +
                  "WHERE SHIFT.Start BETWEEN ? AND ?  AND Employee.DeleteIndicator <> 1 "+
                  "ORDER BY Employee.Name, SHIFT.Start "

            try {
              const stmt = db.prepare(sql)
              const shifts: SummaryShift[] = stmt.all(Start, End);
              const result : Result<SummaryShift[]> = Result.ok(shifts);
              return result
            }
            catch(err) {
                console.log(`Failed @ Shift.GetSummaryShifts all departments ${err}`);
                const result : Result<SummaryShift[]> = Result.fail([err]);
                return result;
            }   
        }

        const sql = "SELECT Employee.Name, Employee.fk_DepartmentId, Employee.pk_EmployeeId, SHIFT.Start, SHIFT.End, SHIFT.BreakTime, SHIFT.Extra FROM SHIFT JOIN " +
        "EMPLOYEE ON SHIFT.fk_EmployeeId = EMPLOYEE.pk_EmployeeId " +
        "WHERE SHIFT.Start BETWEEN ? AND ? AND Employee.DeleteIndicator <> 1 AND Employee.fk_DepartmentId = ? "+
        "ORDER BY Employee.Name, SHIFT.Start "

        try {
            const stmt = db.prepare(sql)
            const shifts: SummaryShift[] = stmt.all(Start, End, DepartmentId);
            const result : Result<SummaryShift[]> = Result.ok(shifts);
            return result;    
        }
        catch(err) {
            console.log(`Failed @ Shift.GetSummaryShifts specific department ${err}`);
            const result : Result<SummaryShift[]> = Result.fail([err]);
            return result;
        }
       
      
    }
// WHERE Start BETWEEN '2022-03-25 00:00:00' AND '2022-04-09 23:59:59'  AND Employee.DeleteIndicator <> 1
}

export default class BackAgent {
    public Employee : Employee;
    public Deparment: Department;
    public Shift: Shift;
    

    private db : bs3.Database;

    constructor(dbPath: string) {
        this.Employee = new Employee();
        this.Deparment = new Department();
        this.Shift = new Shift();
        this.init(dbPath);
    }

    private init(dbPath: string) : void {
        this.db  = new bs3(dbPath, {fileMustExist: true});
    }

    /*EMPLOYEE METHODS*/
    public AddEmployee(Employee : EmployeeModel) :  DbSingleResult {
        return this.Employee.Add(Employee, this.db);
    }

    public EditEmployee(Employee: EmployeeModel) : DbSingleResult {
        return this.Employee.Edit(Employee, this.db);
    }

    public DeleteEmployee(Employee: EmployeeModel) : DbSingleResult {
        return this.Employee.Delete(Employee, this.db);
    }

    public GetEmployees() : EmployeesModel | [] | DbResult {
        return this.Employee.GetAll(this.db);
    }

    /* DEPARTMENT METHODS*/
    public GetDepartments() : DepartmentsModel | DbResult {
        return this.Deparment.GetAll(this.db);
    }

    public AddDepartment(Department: DepartmentModel) : DbSingleResult {
        return this.Deparment.Add(this.db, Department);
    }

    public EditDepartment(Department: DepartmentModel) : DbSingleResult {
        return this.Deparment.Edit(this.db, Department);
    }

    public DeleteDepartment(Department: DepartmentModel) : DbSingleResult {
        return this.Deparment.Delete(this.db, Department);
    }

    /* SHIFT METHODS */
    public AddShift(Shift:ShiftModel) : DbSingleResult {
        return this.Shift.Add(this.db, Shift);
    }

    public GetSingleShifts(start: string, end:string, employeeId: number): Result<ShiftModel[]> {
        return this.Shift.GetShiftsSingleByDate(this.db, start, end, employeeId);
    }

    public EditShift(Shift:ShiftModel) :DbSingleResult {
        return this.Shift.Edit(this.db, Shift)
    }

    public DeleteShift(ShiftId: number): DbSingleResult {
        return this.Shift.Delete(this.db, ShiftId)
    }

    public GetSummaryShifts(Start:string, End: string, Department: string, DepartmentId: number) {
        return this.Shift.GetSummaryShifts(this.db, Start, End, Department, DepartmentId )
    }
    
    public CloseDB(): void {
        this.db.close();
    }
}

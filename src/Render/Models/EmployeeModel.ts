export interface EmployeeModel {
    Name: string;
    pk_EmployeeId: number | null
    fk_DepartmentId: number | null;
    DeleteIndicator: number | boolean;
}


//interface EmployeesModel extends Array<EmployeeModel>{}

export type EmployeesModel = EmployeeModel[];

export default EmployeesModel;
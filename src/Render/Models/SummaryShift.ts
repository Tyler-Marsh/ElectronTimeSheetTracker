export interface SummaryShift {
  Name: string;
  fk_DepartmentId: number;
  pk_EmployeeId: number;
  Start: string;
  End:string;
  Extra: number;
  BreakTime?: number;
}

export interface SummaryObject {
  [key: number] : {
    Name: string;
    pk_EmployeeId: number;
    Total: number // minutes until the end
    RegHours:number; // minutes until t
    Minutes: number; // run total here
    OvertimeInMinutes: number; // run tota
  }
}
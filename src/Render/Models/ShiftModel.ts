export interface ShiftModel {
  pk_ShiftId: number | null
  Start: string;
  End: string;
  fk_EmployeeId: number;
  Comments: string;
  Extra: number;
  BreakTime?: number;
  placeHolder?: boolean;
}

export interface ShiftModelSummary {
  pk_ShiftId: number | null
  Start: string;
  End: string;
  fk_EmployeeId: number;
  comments: string;
  extra: number;
  runningTotal: number;
}

export interface ShiftsModel {
  Shifts: ShiftModel[]
}
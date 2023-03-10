import {Result} from '../../Models/Result';
import moment from 'moment';
import { ShiftModel } from '../../Models/ShiftModel';

  export function getDateRange(startDate: string, endDate: string) : Result<moment.Moment[]> {
  
      if (startDate?.length === 10 && endDate?.length === 10 && moment(startDate, 'MM/DD/YYYY').isValid && moment(endDate, 'MM/DD/YYYY')) {  
          const fromDate = moment(startDate);
          const toDate = moment(endDate);
          const diff = toDate.diff(fromDate, 'days');
          const range = [];
          
          //if(moment(startDate).diff(moment(endDate), 'days') >= 0) {
          if(moment(endDate).diff(moment(startDate), 'days') < 0) {
              const result : Result<moment.Moment[]> = Result.fail(["Start date must be before end date"]);
              return result;
          }
          for (let i = 0; i < diff+1; i++) {
          range.push(moment(startDate).add(i, 'days'));
          //.format("MM/DD/YYYY"));
          }
          if (range.length === 0) {
              range.push(moment(startDate));
          }
          // isSuccess: boolean, error?: string, value?: T
           const aThing: Result<moment.Moment[]> = Result.ok(range);
           return aThing;
      }
      else {
          const errors : string[] = []
          if (startDate.length !== 10) {
              errors.push("Start date isn't valid");     
          }
          if (endDate.length !== 10) {
              errors.push("End data isn't valid");
          }
          if (moment(startDate).diff(moment(endDate)) <= 0) {
            errors.unshift("Start date must be before End date")
          }
          const result : Result<moment.Moment[]> = Result.fail(errors)
          return result;
          }
}

export function validDateRange(startDate: string, endDate: string): boolean {
   if(startDate?.length === 10 && endDate?.length === 10 && moment(startDate, 'MM/DD/YYYY').isValid && moment(endDate, 'MM/DD/YYYY')) {
     return moment(endDate).diff(moment(startDate), 'days') > 0
   }
}


export function buildPlaceholderShift(day: string): ShiftModel {
    const optionalShift = {
        pk_ShiftId: 0,
        Start: day,
        End: '',
        fk_EmployeeId: 0,
        Comments: '',
        Extra: 0,
        placeHolder: true,
        breakTime: 0,
    }
    return optionalShift;
}
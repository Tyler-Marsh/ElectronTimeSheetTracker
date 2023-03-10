export class ApiResult<T> {
  public isSuccess: boolean;
  public errorMessages: string[];
  public value: T;

  /* FAIL CASE SCENARIO */
  // success?
  //
  constructor(isSuccess: boolean, errorMessages: string[], aValue?: T ) {
   if (isSuccess) {
    this.isSuccess = isSuccess;
    this.errorMessages = errorMessages;
    this.value = aValue;
   }
   else {
     this.isSuccess = false;
     this.errorMessages= errorMessages;
   }
  }
}
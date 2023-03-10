export class Result<T> {
  public isSuccess: boolean;
  public isFailure: boolean
  //public error: string;
  public errorMessages: string[];
  private _value: T;


  private constructor (isSuccess: boolean, errorMessages?: string[], value?: T) {
    if (isSuccess && errorMessages) {
      throw new Error(`InvalidOperation: A result cannot be 
        successful and contain an error`);
    }
    if (!isSuccess && !errorMessages) {
      throw new Error(`InvalidOperation: A failing result 
        needs to contain an error message`);
    }

    this.isSuccess = isSuccess;
    this.isFailure = !isSuccess;
    this.errorMessages = errorMessages;
    this._value = value;
    
    Object.freeze(this);
  }

  public getValue () : T {
    if (!this.isSuccess) {
      throw new Error(`Cant retrieve the value from a failed result.`)
    } 

    return this._value;
  }

  public static ok<U> (value?: U) : Result<U> {
    return new Result<U>(true, null, value);
  }

  public static fail<U> (errorMessages: string[]): Result<U> {
    return new Result<U>(false, errorMessages);
  }

  public static combine (results: Result<any>[]) : Result<any> {
    for (let result of results) {
      if (result.isFailure) return result;
    }
    return Result.ok<any>();
  }
}
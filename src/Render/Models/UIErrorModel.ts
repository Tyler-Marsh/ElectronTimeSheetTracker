export default interface UIErrorModel {
  error: boolean;
  messages: string[]
}

export function TestModel(object: any) {
  return 'error' in object;
}
// instanceof to check if it is the proper type
export interface ModalInput {
  FieldName: string;
  regexValidator: RegExp[];
  validationMessage: string[];
  value: string;
}

export interface ModalInputs {
  inputs: ModalInput[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange: any | null;
}

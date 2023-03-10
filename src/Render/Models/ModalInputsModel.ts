
export interface ModalInput {
    FieldName: string;
    regexValidator: RegExp[];
    validationMessage: string[];
    value: string;
}


export interface ModalInputs {
    inputs : ModalInput[]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onChange: any | null
}

/* 
 inputs: {} | null {
 input1: {
    FieldName: fieldName,
    regexValidators: [],
	// that way can make sure it passes multiple
    // regex checks
    validationMessage: string;
    { error && <p> {error } </p>
    // make the class have some animation to pop out from where
	it is
// onsubmit
*/
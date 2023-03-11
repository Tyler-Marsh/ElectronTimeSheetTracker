import React, { useContext, useState } from "react";
import { observer } from "mobx-react-lite";
import DbSingleResult from "../../Models/DbSingleResult";
import { RootStoreContext } from "../../Stores/RootStore";

interface State {
  Name: "";
  Department: number;
  Step: number;
  APISuccess: boolean | null | undefined;
  APIMessage: string;
}

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  close: any;
  departmentId: number;
  Name: string;
}

function EditDepartment(Props: Props) {
  const { employeeStore, settingsStore, departmentStore } =
    useContext(RootStoreContext);

  // myArray.find(x => x.id === '45').foo;
  const [state, setState] = useState({
    Name: Props.Name,
    Step: 1,
    APISuccess: null,
    APIMessage: "",
  });

  const FormChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    const { name, value } = event.target;
    setState({ ...state, [name]: value });
    return;
  };

  const Submit = async (): Promise<void> => {
    const aDepartment = {
      pk_DepartmentId: Props.departmentId,
      Name: state.Name,
    };
    const result: DbSingleResult = await window.e_AddRemove.EditDepartment(
      settingsStore.SelectedDb,
      aDepartment
    );

    if (result.success) {
      departmentStore.EditDepartment(aDepartment);
      setState({
        ...state,
        Step: 2,
        APISuccess: true,
        APIMessage: result.message,
        Name: "",
      });
      return;
    }

    setState({ ...state, APISuccess: false, APIMessage: result.message });
    return;
  };

  if (state.Step === 1) {
    return (
      <>
        <p
          style={{
            textAlign: "center",
            marginTop: "0rem",
            borderBottom: "1px solid gainsboro",
          }}
        >
          Edit Existing Department
        </p>
        <div style={{ height: "2rem", margin: "0px auto", width: "50%" }}></div>
        <div className="formGroup">
          <label className="formLabel" htmlFor="Name">
            Name
          </label>
          <input
            value={state.Name}
            onChange={(e) => {
              FormChange(e);
            }}
            type="text"
            className="formInput"
            placeholder="Name"
            name="Name"
          ></input>
        </div>

        <div className="formGroup">
          <button
            onClick={() => {
              Submit();
            }}
          >
            Submit
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <p
        style={{
          textAlign: "center",
          marginTop: "0rem",
          borderBottom: "1px solid gainsboro",
        }}
      >
        Edit Existing Department
      </p>
      <div style={{ height: "2rem", margin: "0px auto", width: "50%" }}></div>
      <p style={{ textAlign: "center" }}>{state.APIMessage}</p>
      <div className="formGroup">
        <button onClick={Props.close}>Ok</button>
      </div>
    </>
  );
}

export default observer(EditDepartment);

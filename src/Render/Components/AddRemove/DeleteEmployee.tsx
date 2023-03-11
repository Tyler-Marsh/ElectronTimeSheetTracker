import React, { useContext, useState } from "react";
import { observer } from "mobx-react-lite";
import { EmployeeModel } from "../../Models/EmployeeModel";
import DbSingleResult from "../../Models/DbSingleResult";
import { RootStoreContext } from "../../Stores/RootStore";

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  close: any;
  employeeId: number;
}

function DeleteEmployee(Props: Props): JSX.Element {
  const { employeeStore, settingsStore } = useContext(RootStoreContext);

  const [state, setState] = useState({
    Step: 1,
    APISuccess: null,
    APIMessage: "",
  });

  const Submit = async (): Promise<void> => {
    const anEmployee: EmployeeModel = {
      Name: "",
      pk_EmployeeId: Props.employeeId,
      fk_DepartmentId: 0,
      DeleteIndicator: 0,
    };
    const result: DbSingleResult = await window.e_AddRemove.DeleteEmployee(
      settingsStore.SelectedDb,
      anEmployee
    );

    if (result.success) {
      employeeStore.DeleteEmployee(anEmployee);
      setState({ Step: 2, APISuccess: true, APIMessage: result.message });

      return;
    }
    setState({ ...state, APISuccess: false, APIMessage: result.message });
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
          Delete an employee
        </p>
        <div style={{ height: "2rem", margin: "0px auto", width: "50%" }}></div>
        <div className="formGroup">
          <label className="formLabel">
            Are you sure you want to delete this employee?
          </label>
          <label className="formLabel">
            {
              employeeStore.Employees.find(
                (x) => x.pk_EmployeeId === Props.employeeId
              ).Name
            }
          </label>
        </div>
        <div className="formGroup">
          <button
            onClick={() => {
              Submit();
            }}
          >
            Yes
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
        Delete an employee
      </p>
      <div style={{ height: "2rem", margin: "0px auto", width: "50%" }}></div>
      <p style={{ textAlign: "center" }}>{state.APIMessage}</p>
      <div className="formGroup">
        <button onClick={Props.close}>Ok</button>
      </div>
    </>
  );
}

export default observer(DeleteEmployee);

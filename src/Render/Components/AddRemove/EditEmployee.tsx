import React, { useContext, useState } from "react";
import { observer } from "mobx-react-lite";
import { EmployeeModel } from "../../Models/EmployeeModel";
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
  employeeId: number;
}

function EditEmployee(Props: Props) {
  const { employeeStore, settingsStore, departmentStore } =
    useContext(RootStoreContext);

  // myArray.find(x => x.id === '45').foo;
  const [state, setState] = useState({
    Name: employeeStore.Employees.find(
      (x) => x.pk_EmployeeId === Props.employeeId
    ).Name,
    Department:
      departmentStore.Departments[
        employeeStore.Employees.find(
          (x) => x.pk_EmployeeId === Props.employeeId
        ).fk_DepartmentId
      ],
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
    const anEmployee: EmployeeModel = {
      Name: state.Name,
      pk_EmployeeId: Props.employeeId,
      fk_DepartmentId: parseInt(state.Department),
      DeleteIndicator: 0,
    };
    console.log("Updating Employee \n", anEmployee);
    const result: DbSingleResult = await window.e_AddRemove.EditEmployee(
      settingsStore.SelectedDb,
      anEmployee
    );

    if (result.success) {
      employeeStore.EditEmployee(anEmployee);
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
          Edit Existing Employee
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
          <label className="formLabel" htmlFor="Department">
            Department
          </label>
          <select
            name="Department"
            onChange={(e) => {
              FormChange(e);
            }}
            className="formSelect"
          >
            <option value={0}>All</option>
            {Object.keys(departmentStore.Departments).map((department, key) => (
              <option value={department} key={key}>
                {departmentStore.Departments[parseInt(department)]}
              </option>
            ))}
          </select>
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
        Edit Existing Employee
      </p>
      <div style={{ height: "2rem", margin: "0px auto", width: "50%" }}></div>
      <p style={{ textAlign: "center" }}>{state.APIMessage}</p>
      <div className="formGroup">
        <button onClick={Props.close}>Ok</button>
      </div>
    </>
  );
}

export default observer(EditEmployee);

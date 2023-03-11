import React, { useContext, useState } from "react";
import { observer } from "mobx-react-lite";
import { EmployeeModel } from "../../Models/EmployeeModel";
import DbSingleResult from "../../Models/DbSingleResult";
import { RootStoreContext } from "../../Stores/RootStore";

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  close: any;
}

function Employee(Props: Props) {
  const [state, setState] = useState({
    Name: "",
    Department: 0,
    Step: 1,
    APISuccess: null,
    APIMessage: "",
  });

  const { employeeStore, settingsStore, departmentStore } =
    useContext(RootStoreContext);

  const departments = Object.keys(departmentStore.Departments);

  const FormChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    const { name, value } = event.target;
    if (name === "Department") {
      setState({ ...state, [name]: parseInt(value) });
      return;
    }
    setState({ ...state, [name]: value });
    return;
  };

  const Submit = async (): Promise<void> => {
    // pk_EmployeeId
    // Name
    // fk_DepartmendId
    // DeleteIndicator

    const anEmployee: EmployeeModel = {
      Name: state.Name,
      pk_EmployeeId: 0,
      fk_DepartmentId: 0,
      DeleteIndicator: 0,
    };
    const result: DbSingleResult = await window.e_AddRemove.AddEmployee(
      settingsStore.SelectedDb,
      anEmployee
    );

    if (result.success) {
      anEmployee.pk_EmployeeId = result.rowId;
      employeeStore.AddEmployee(anEmployee);
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
          Add an employee
        </p>
        <div style={{ height: "2rem", margin: "0px auto", width: "50%" }}></div>
        <div className="formGroup">
          <label className="formLabel" htmlFor="Name">
            Name
          </label>
          <input
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
            onChange={(e) => {
              FormChange(e);
            }}
            className="formSelect"
          >
            <option value={0}>All</option>
            {departments.map((department, key) => (
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
        Add an employee
      </p>
      <div style={{ height: "2rem", margin: "0px auto", width: "50%" }}></div>
      <p style={{ textAlign: "center" }}>{state.APIMessage}</p>
      <div className="formGroup">
        <button onClick={Props.close}>Ok</button>
      </div>
    </>
  );
}

export default observer(Employee);

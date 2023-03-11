import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import Modal from "../Containers/Modal";
import EditDepartment from "./EditDepartment";
import EditIcon from "./EditIcon";

interface Props {
  Name: string;
  id: number;
}

function EditDepartmentButton(Props: Props) {
  const [showForm, setShowForm] = useState(false);

  const Close = () => {
    setShowForm(false);
  };

  const editDepartment = (
    <EditDepartment close={Close} departmentId={Props.id} Name={Props.Name} />
  );
  return (
    <>
      <button
        className="cellButton"
        onClick={() => {
          setShowForm(true);
        }}
      >
        <EditIcon />
      </button>
      <Modal childComponent={editDepartment} show={showForm} close={Close} />
    </>
  );
}

export default observer(EditDepartmentButton);

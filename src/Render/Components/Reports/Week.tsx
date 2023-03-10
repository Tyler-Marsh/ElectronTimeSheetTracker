import React, { useState, useContext } from "react";
import { ShiftModel } from "../../Models/ShiftModel";
import DateRow from "./DateRow";
import moment from "moment";
import { RootStoreContext } from "../../Stores/RootStore";
import DbSingleResult from "../../Models/DbSingleResult";
import AddEditShiftForm from "./AddEditShiftForm";
import Modal from "../Containers/Modal";
import DeleteShiftForm from "./DeleteShiftForm";
import { roundingFun } from "../../Helpers/rounding";

interface Props {
  shifts: ShiftModel[];
  addShift: any;
}

interface State {
  shifts: ShiftModel[];
  index: number;
  modal: "edit" | "delete" | "add" | "none";
}

function Week(Props: Props) {
  const { employeeStore, settingsStore } = useContext(RootStoreContext);

  const [state, setState] = useState<State>({
    shifts: Props.shifts,
    index: 0,
    modal: "none",
  });

  const selectModal = (index: number, modal: "edit" | "delete" | "add") => {
    setState({ ...state, index, modal });
  };

  const close = () => {
    setState({ ...state, modal: "none" });
  };

  function runTotal(startTime: any, endTime: any, breakTime: any, extra: any) {
    const end = moment(endTime);
    const duration = moment.duration(end.diff(startTime));
    let Ogminutes = duration.asMinutes();
    Ogminutes = Ogminutes + extra * 60;
    if (breakTime) {
      Ogminutes = Ogminutes - breakTime;
    }
    if (settingsStore.SettingsJSON.rounding === "quarter") {
      const result = roundingFun(Ogminutes);
      return result;
    }
    return Ogminutes / 60;
  }

  function returnTotal(total: number): string {
    if (total === 0) {
      return "0";
    }
    if (settingsStore.SettingsJSON.rounding === "quarter") {
      const totalMinutes = total * 60;
      const result = roundingFun(totalMinutes);

      const hours = Math.floor(result);
      const minutes: number = total * 60 - hours * 60;

      return `${hours}h ${Math.round(minutes)}m`;
    }
    /* get settings */
    // to nearest 15 minutes....
    const hours = Math.floor(total);
    const minutes: string | number = total * 60 - hours * 60;

    return `${hours}h ${Math.round(minutes)}m`;
  }

  const DeleteShift = async (ShiftId: number, StartDate: string) => {
    const result = await window.e_Shift.DeleteShift(
      settingsStore.SelectedDb,
      ShiftId
    );
    afterDelete(ShiftId, StartDate);
    return result;
  };

  const afterDelete = (ShiftId: number, StartDate: string) => {
    const theStartDate = moment(StartDate);
    let countSameDays = 0;
    state.shifts.forEach((shift) => {
      // get the shift date too so compare
      // only an issue when the shift doesn't share a date...

      if (moment(shift.Start).format("d") === theStartDate.format("d")) {
        countSameDays++;
      }
    });

    const sortedArray = [];
    let floatingShift;
    for (let shift = 0; shift < state.shifts.length; shift++) {
      // floatingShift.placeHolder = true;
      if (state.shifts[shift].pk_ShiftId === ShiftId) {
        if (countSameDays > 1) {
          continue;
        }
        floatingShift = state.shifts[shift];
        floatingShift.placeHolder = true;
        floatingShift.Start = moment(floatingShift.Start)
          .set("hour", 8)
          .set("minute", 0)
          .format("YYYY-MM-DD HH:mm:ss");
        floatingShift.End = moment(floatingShift.Start)
          .set("hour", 8)
          .set("minute", 0)
          .format("YYYY-MM-DD HH:mm:ss");
        floatingShift.Extra = 0;

        sortedArray.push(floatingShift);
        continue;
      }
      sortedArray.push(state.shifts[shift]);
    }
    setState({ ...state, shifts: sortedArray });
  };

  const EditShift = async (editedShift: ShiftModel) => {
    const result = await window.e_Shift.EditShift(
      settingsStore.SelectedDb,
      editedShift
    );
    if (result.success) {
      const stateCopy = state.shifts.map((shift) => {
        if (editedShift.pk_ShiftId === shift.pk_ShiftId) {
          return editedShift;
        }
        return shift;
      });

      const sortedArray = stateCopy.sort(function (
        left: ShiftModel,
        right: ShiftModel
      ) {
        return moment(left.Start).diff(moment(right.Start));
      });
      setState({ ...state, shifts: sortedArray });
    }
    return result;
  };

  const addShift = async (Shift: ShiftModel) => {
    Shift.placeHolder === false;

    const result: DbSingleResult = await window.e_Shift.AddShift(
      settingsStore.SelectedDb,
      Shift
    );
    if (result.success === true) {
      Shift.pk_ShiftId = result.rowId;
      afterAdd(Shift);
    }
    return result;
  };

  const afterAdd = (Shift: ShiftModel) => {
    const firstShift = moment(state.shifts[0].Start, "YYYY-MM-DD");
    const lastShift = moment(
      state.shifts[state.shifts.length - 1].Start,
      "YYYY-MM-DD"
    );
    if (
      !moment(Shift.Start, "YYYY-MM-DD").isBetween(
        firstShift,
        lastShift,
        null,
        "[]"
      )
    ) {
      return;
    }
    //  out.innerText =  addedDay2.isBetween(firstDay, lastDay, null, '[]')
    const stateCopy = state.shifts.map((shift) => {
      return shift;
    });

    const shiftDay = moment(Shift.Start).day();

    // stateCopy.splice(stateCopy.findIndex(shift => moment(shift.Start).day() === shiftDay && shift.placeHolder === true), 1)
    for (let i = 0; i < stateCopy.length; i++) {
      if (
        moment(stateCopy[i].Start).day() === shiftDay &&
        stateCopy[i].placeHolder === true
      ) {
        stateCopy.splice(i, 1);
      }
    }

    stateCopy.push(Shift);
    // const sortedArray = stateCopy.sort((a,b) => return moment(a.Start).format('yyyy-mm-dd hh:mm') - moment(b.Start))

    const sortedArray = stateCopy.sort(function (
      left: ShiftModel,
      right: ShiftModel
    ) {
      return moment(left.Start).diff(moment(right.Start));
    });

    setState({ ...state, shifts: sortedArray });
  };

  const totals = { Extra: 0, Total: 0 };
  // have a last day variable
  // then pass DayRow another prop to determine if I should actually
  // render the DoW and Date
  let day = moment(state.shifts[0]?.Start).day();
  let showDateInfo = true;
  const dates = state.shifts.map((shift, index) => {
    if (index !== 0) {
      showDateInfo = moment(shift.Start).day() === day ? false : true;
      day = moment(shift.Start).day();
    }
    if (shift.End !== "") {
      totals.Total += runTotal(
        shift.Start,
        shift.End,
        shift.BreakTime,
        shift.Extra
      );
      // runTotal will need to see the rounding rules
    }

    totals.Extra += shift.Extra;
    return (
      <DateRow
        selectModal={selectModal}
        showDateInfo={showDateInfo}
        key={index}
        Shift={shift}
        Index={index}
      />
    );
  });

  return (
    <>
      {dates}
      <tr
        className="shiftCell"
        style={{
          backgroundColor: "rgba(0, 116, 217, .5)",
          fontSize: "16px",
          padding: "0px 0px",
          margin: "0px 0px",
          textAlign: "right",
        }}
      >
        <td style={{ textAlign: "center" }} className="shiftCell">
          Weekly totals
        </td>
        <td className="shiftCell"></td>
        <td className="shiftCell"></td>
        <td className="shiftCell"></td>
        <td className="shiftCell">{returnTotal(totals.Extra)}</td>
        <td className="shiftCell"></td>
        <td className="shiftCell">{returnTotal(totals.Total)}</td>
        <td className="shiftCell"></td>
        <td className="shiftCell"></td>
      </tr>
      {state.modal === "add" && (
        <Modal
          show={true}
          close={close}
          childComponent={
            <AddEditShiftForm
              type="add"
              title="Enter a new Shift"
              submit={addShift}
              shiftId="0"
              in="08:00 am"
              out="05:00 pm"
              extra=""
              comments=""
              close={close}
              date={moment(state.shifts[state.index].Start).format(
                "MM/DD/YYYY"
              )}
              employeeId={settingsStore.SelectedEmployeeId}
              BreakTime={0}
            />
          }
        />
      )}

      {state.modal === "edit" && (
        <Modal
          show={true}
          close={close}
          childComponent={
            <AddEditShiftForm
              type="edit"
              title="Edit current shift"
              submit={EditShift}
              shiftId={state.shifts[state.index].pk_ShiftId.toString()}
              in={moment(state.shifts[state.index].Start).format("hh:mm a")}
              out={moment(state.shifts[state.index].End).format("hh:mm a")}
              extra={state.shifts[state.index].Extra.toString()}
              comments={state.shifts[state.index].Comments}
              close={close}
              date={moment(state.shifts[state.index].Start).format(
                "MM/DD/YYYY"
              )}
              employeeId={state.shifts[state.index].fk_EmployeeId}
              BreakTime={state.shifts[state.index].BreakTime}
            />
          }
        />
      )}

      {state.modal === "delete" && (
        <Modal
          show={true}
          close={close}
          childComponent={
            <DeleteShiftForm
              shift={state.shifts[state.index]}
              index={state.index}
              close={close}
              submit={DeleteShift}
            />
          }
        />
      )}
    </>
  );
}

export default Week;

import { set } from "mobx";
import React, { useState, useRef, useEffect, useReducer } from "react";

interface Props {
  time: string;
  blurValidateTime: any;
  InOrOut: string;
  PlusMinusHours: any;
  PlusMinusMin: any;
  timeInputChange: any;
  toggleAMPM: any;
  change: any;
}

interface State {
  hours: string | number;
  minutes: string;
  AMPM: "AM" | "PM";
}

// function reducer(state: State, action: {type : string, minutes: number, hours: string | number, AMPM: 'AM' | 'PM' }) {
// 	const { type, minutes, hours, AMPM } = action;
// 	switch(type) {
// 		case 'update-minutes':
// 			return {...state, minutes};
// 		case 'update-hours':
// 			return {...state, hours};
// 		case 'update-AMPM':
// 			return {...state, AMPM};

// 		default:
// 			return {...state};
// 	}
// }

function TimeInput(Props: Props) {
  const [show, setShow] = useState(false);
  const inputRef: React.RefObject<HTMLDivElement> = useRef();

  const aState: State = {
    hours: Props.time.substring(0, 2),
    minutes: Props.time.substring(3, 5),
    AMPM: "AM",
  };

  console.log("PROPS.TIME: " + Props.time);

  const [state, setState] = useState(aState);

  const hide = () => {
    setShow(false);
    // dispatch({.})
    // make sure the states match up?

    // WRITE NEW FORM WITH DRAG DOWNS?
  };

  const makeShow = () => {
    setShow(true);
  };

  const getAMPM = (): string => {
    return state.AMPM;
  };

  const getBlurTime = (): string => {
    return `${state.hours}:${state.minutes} ${state.AMPM}`;
  };

  useEffect(() => {
    document.addEventListener("mousedown", (event: any) => {
      if (inputRef.current && !inputRef?.current.contains(event.target)) {
        console.log("PROPS TIME: " + Props.time);

        let hours: any = document.getElementById(`${Props.InOrOut}-Hours`);

        const minutesArr: NodeListOf<HTMLInputElement> =
          document.querySelectorAll(".timeDigitInput");

        const minutes = minutesArr[1].value + minutesArr[2].value;
        const finalTime = hours.value + minutes + " " + getAMPM();

        console.log("FINAL TIME: " + finalTime);

        //  Props.blurValidateTime(Props.InOrOut,'9', state.AMPM)
        hide();
        // doesn't work because the props don't ever change???

        //Props.blurValidateTime(Props.InOrOut, Props.time, Props.time.substring(6,8));
      }
    });
  });

  const numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ""];
  const changeHours = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const value = event.target.value;
    // 09/092
    const areNumbers = value.replace(/\//g, "");
    for (let i = 0; i < areNumbers.length; i++) {
      if (numbers.indexOf(areNumbers[i]) === -1) {
        return;
      }

      if (value.length === 1 && parseInt(value) > 1) {
        setState({ ...state, hours: 1 });

        return;
      }
      if (value.length === 2 && parseInt(value) > 12) {
        setState({ ...state, hours: 12 });
        return;
      }
      // logic to make sure they can't enter more than 12
    }
  };

  const handleSelectInput = (event: any) => {
    try {
      event.target.select();
    } catch (e) {
      console.log(e);
    }
  };

  const handleHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === "") {
      setState({ ...state, hours: "" });
    }
    const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    if (
      !numbers.includes(parseInt(e.target.value[e.target.value.length - 1]))
    ) {
      return;
    }
    if (state.hours.toString().length > e.target.value.length) {
      const length = state.hours.toString().length;
      let final =
        e.target.value.length === 0 ? 0 : parseInt(state.hours.toString()[0]);

      setState({ ...state, hours: final });
    }

    if (e.target.value[0] === "0" && !isNaN(parseInt(e.target.value))) {
      setState({ ...state, hours: e.target.value });
    }
    let num = parseInt(e.target.value);
    if (!isNaN(num)) {
      setState({ ...state, hours: num });
    }
  };

  const setHoursToSubString = () => {
    if (state.hours === "") {
      setState({ ...state, hours: Props.time.substring(0, 2) });
    }
  };

  const incrementTimeInputHours = () => {
    let hours;
    if (typeof state.hours === "string") {
      hours = parseInt(state.hours);
      hours = hours === 12 ? 1 : hours + 1;
      setState({ ...state, hours });
      return;
    }
    if (typeof state.hours === "number") {
      hours = state.hours;
      hours = state.hours === 12 ? 1 : hours + 1;
      setState({ ...state, hours: hours });
    }
  };

  const decrementTimeInputHours = () => {
    let hours;
    if (typeof state.hours === "string") {
      hours = parseInt(state.hours);
      hours = hours === 1 ? 12 : hours - 1;
      setState({ ...state, hours: hours });
      return;
    }
    if (typeof state.hours === "number") {
      hours = state.hours;
      hours = state.hours === 1 ? 12 : hours - 1;
      setState({ ...state, hours: hours });
    }
  };

  const setAMPM = () => {
    if (state.AMPM === "AM") {
      setState({ ...state, AMPM: "PM" });
      return;
    }
    setState({ ...state, AMPM: "AM" });
    return;
  };

  if (Props.InOrOut == "in") {
    console.log(Props.time);
  }
  return (
    <div>
      <p>Time {Props.InOrOut === "in" ? "In" : "Out"}</p>
      <div className="flexFormItem">
        <input
          name={Props.InOrOut}
          onChange={(e) => {
            Props.change(e);
          }}
          value={Props.time}
          onBlur={() => {
            setHoursToSubString(),
              Props.blurValidateTime(
                Props.InOrOut,
                Props.time,
                Props.InOrOut === "in" ? "am" : "pm"
              );
          }}
          style={{ borderRight: "none" }}
          className="timeInput"
        ></input>
        <div className="timeTooltip" style={{ position: "relative" }}>
          <button onClick={() => makeShow()} className="clockFlexIcon">
            &#128338;
          </button>
          {show && (
            <div ref={inputRef} className="timeModal">
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <button
                  onClick={() => {
                    incrementTimeInputHours(),
                      Props.PlusMinusHours(
                        Props.InOrOut,
                        "plus",
                        Props.time.substring(0, 2)
                      );
                  }}
                  className="timeButton"
                >
                  <i className="upTime"></i>
                </button>
                <p style={{ visibility: "hidden" }}>:</p>
                <button
                  onClick={() => {
                    Props.PlusMinusMin(
                      Props.InOrOut,
                      "plus",
                      Props.time.substring(3, 4),
                      3
                    );
                  }}
                  className="timeButton"
                >
                  <i className="upTime"></i>
                </button>
                <button
                  onClick={() => {
                    Props.PlusMinusMin(
                      Props.InOrOut,
                      "plus",
                      Props.time.substring(4, 5),
                      4
                    );
                  }}
                  className="timeButton"
                >
                  <i className="upTime"></i>
                </button>
                <div>
                  <button style={{ visibility: "hidden" }}>{state.AMPM}</button>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                {/* ADDED ON BLUR INSTEAD TO CHECK HOW THIS WILL WORK */}
                {/* value={Props.time.substring(0,2)}  */}

                <input
                  id={`${Props.InOrOut}-Hours`}
                  onChange={(e) => {
                    handleHourChange(e);
                  }}
                  onBlur={(e) => {
                    Props.timeInputChange(Props.InOrOut, 1, e);
                  }}
                  onClick={(e) => {
                    handleSelectInput(e);
                  }}
                  value={state.hours}
                  type="text"
                  maxLength={2}
                  className="timeDigitInput"
                ></input>
                <label>:</label>
                <input
                  onChange={(e) => {
                    Props.timeInputChange(Props.InOrOut, 3, e);
                  }}
                  value={Props.time.substring(3, 4)}
                  onClick={(e) => {
                    handleSelectInput(e);
                  }}
                  type="text"
                  maxLength={1}
                  className="timeDigitInput"
                ></input>
                <input
                  onChange={(e) => {
                    Props.timeInputChange(Props.InOrOut, 4, e);
                  }}
                  value={Props.time.substring(4, 5)}
                  onClick={(e) => {
                    handleSelectInput(e);
                  }}
                  type="text"
                  maxLength={1}
                  className="timeDigitInput"
                ></input>
                <div>
                  <button
                    onClick={() => {
                      Props.toggleAMPM(Props.InOrOut), setAMPM();
                    }}
                  >
                    {Props.time.substring(6, 8)}
                  </button>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <button
                  onClick={() => {
                    decrementTimeInputHours(),
                      Props.PlusMinusHours(
                        Props.InOrOut,
                        "minus",
                        Props.time.substring(0, 2)
                      );
                  }}
                  className="timeButton"
                >
                  <i className="downTime"></i>
                </button>
                <p style={{ visibility: "hidden" }}>:</p>
                <button
                  onClick={() => {
                    Props.PlusMinusMin(
                      Props.InOrOut,
                      "minus",
                      Props.time.substring(3, 4),
                      3
                    );
                  }}
                  className="timeButton"
                >
                  <i className="downTime"></i>
                </button>
                <button
                  onClick={() => {
                    Props.PlusMinusMin(
                      Props.InOrOut,
                      "minus",
                      Props.time.substring(4, 5),
                      4
                    );
                  }}
                  className="timeButton"
                >
                  <i className="downTime"></i>
                </button>
                <div>
                  <button style={{ visibility: "hidden" }}>
                    {Props.time.substring(6, 8)}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TimeInput;

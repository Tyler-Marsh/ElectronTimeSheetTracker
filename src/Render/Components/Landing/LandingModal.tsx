import React, {
  Dispatch,
  MouseEventHandler,
  ReactElement,
  SetStateAction,
} from "react";
import ReactDOM from "react-dom";
import CreateDBForm from "./CreateDBForm";

interface Props {
  show: boolean;
  hide: MouseEventHandler<HTMLButtonElement>; //Dispatch<SetStateAction<boolean>>; // MouseEventHandler<HTMLButtonElement> //
  buttonText: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleButton: Dispatch<SetStateAction<boolean>> | null | any;
  resultMessage: string;
  title: string;
  DBForm: boolean;
  files: string[];
  buttonMargin: number | null;
}

export default function LandingModal(Props: Props): ReactElement {
  const handleClose = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const modal = document.querySelector(".modal");
    modal.classList.toggle("modal1");
    setTimeout(() => {
      Props.hide(e);
    }, 200);
  };
  const element: ReactElement | null =
    Props.show === true
      ? ReactDOM.createPortal(
          <React.Fragment>
            <div className="modal-overlay" />
            <div
              className="modal-wrapper"
              aria-modal
              aria-hidden
              tabIndex={-1}
              role="dialog"
            >
              <div className="modal">
                <div className="modal-header">
                  <div></div>
                  <button
                    type="button"
                    className="modal-close-button"
                    data-dismiss="modal"
                    aria-label="Close"
                    onClick={(e) => {
                      handleClose(e);
                    }}
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <p
                  style={{
                    textAlign: "center",
                    borderBottom: "1px gainsboro solid",
                  }}
                >
                  {Props.title}
                </p>

                <div
                  style={{
                    height: "2rem",
                    marginTop: "0rem",
                    width: "50%",
                    margin: "0 auto",
                  }}
                >
                  {Props.resultMessage !== "" && Props.resultMessage && (
                    <p style={{ textAlign: "center", marginTop: "1rem" }}>
                      {Props.resultMessage}
                    </p>
                  )}
                </div>

                {Props.DBForm === false && (
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    {Props.handleButton !== null &&
                      Props.handleButton !== undefined && (
                        <button
                          className="landingButton"
                          style={{
                            marginTop:
                              (Props.buttonMargin || 0).toString() + "rem",
                          }}
                          onClick={Props.handleButton}
                        >
                          {Props.buttonText}
                        </button>
                      )}
                  </div>
                )}

                {Props.DBForm && (
                  <CreateDBForm
                    handleSubmit={Props.handleButton}
                    files={Props.files}
                  />
                )}
              </div>
            </div>
          </React.Fragment>,
          document.body
        )
      : null;
  return <>{element}</>;
}

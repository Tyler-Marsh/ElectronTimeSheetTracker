import { observer } from "mobx-react-lite";
import React, { MouseEventHandler, ReactElement, useState } from "react";
import ReactDOM from "react-dom";

interface Props {
  // props to show
  show: boolean;
  // function to close the modal
  close: MouseEventHandler<HTMLButtonElement>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  childComponent: React.FC | any;
}

function Modal(Props: Props): ReactElement {
  const handleClose = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const modal = document.querySelector(".modal");
    modal.classList.toggle("modal1");

    setTimeout(() => {
      Props.close(e);
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
                {Props.childComponent}
              </div>
            </div>
          </React.Fragment>,
          document.body
        )
      : null;
  return <>{element}</>;
}

export default observer(Modal);

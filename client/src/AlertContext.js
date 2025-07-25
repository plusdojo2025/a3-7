import React, { createContext, useState } from "react";

export const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const [alert, setAlert] = useState({ show: false, title: "", message: "" });

  const showAlert = (title, message) => {
    setAlert({ show: true, title, message });
  };

  const hideAlert = () => {
    setAlert({ show: false, title: "", message: "" });
  };

  return (
    <AlertContext.Provider value={{ showAlert, hideAlert, alert }}>
      {children}
      {alert.show && (
        <div className="dialog">
          <div className="dialog-content">
            <div className="dialog-header">
              <span className="dialog-title">{alert.title}</span>
              <button className="close-btn-x" onClick={hideAlert}>×</button>
            </div>
            <div className="dialog-body">
              <p>{alert.message}</p>
            </div>
            <div className="dialog-footer">
              <button className="btn-primary" onClick={hideAlert}>OK</button>
            </div>
          </div>
        </div>
      )}
    </AlertContext.Provider>
  );
};

import React, { useEffect } from "react";
import { FiX } from "react-icons/fi";
import { useRecoilState } from "recoil";
import { alertAtom } from "../recoil/alertAtom";

const Alert = () => {
  const [alert, setAlert] = useRecoilState(alertAtom);

  useEffect(() => {
    if (alert.open) {
      setTimeout(() => {
        setAlert({ ...alert, open: false });
      }, 5000);
    }
  }, [alert.open]);

  return (
    <div className={`alert ${alert.open ? "" : "hide"} ${alert.type}`}>
      <div className="message">{alert.message}</div>
      <div>
        <FiX onClick={() => setAlert({ ...alert, open: false })} />
      </div>
    </div>
  );
};

export default Alert;

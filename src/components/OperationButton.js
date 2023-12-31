import React from "react";
import { ACTIONS } from "../App";
export default function OperationButton({ dispatch, operator }) {
  return (
    <button
      onClick={() => {
        console.log(operator);
        dispatch({ type: ACTIONS.CHOOSE_OPERATION, payload: { operator } });
      }}
    >
      {operator}
    </button>
  );
}

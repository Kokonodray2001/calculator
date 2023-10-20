import { useReducer } from "react";
import "./style.css";
import DigitButton from "./components/DigitButton";
import OperationButton from "./components/OperationButton";
export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  CLEAR: "clear",
  CHOOSE_OPERATION: "choose-operation",
  EVALUATE: "evaluate",
  DELETE: "delete",
};

function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.ADD_DIGIT:
      if (action.payload.digit === "0" && state.currentOperend === "0")
        return state;
      if (
        action.payload.digit === "." &&
        state.currentOperend &&
        state.currentOperend.includes(".")
      )
        return state;
      if (state.overWrite) {
        return {
          ...state,
          overWrite: false,
          currentOperend: action.payload.digit,
        };
      }
      return {
        ...state, // parts of the perivous state

        currentOperend: `${state.currentOperend || ""}${action.payload.digit}`, // adding details
      };

    case ACTIONS.CLEAR:
      return {
        
        currentOperend: "",
      };

    case ACTIONS.CHOOSE_OPERATION:
      console.log(action.payload.operator);
      if (state.currentOperend == null && state.previousOperend == null)
        return state;
      if (state.previousOperend == null) {
        return {
          ...state,
          operation: action.payload.operator,
          previousOperend: state.currentOperend,
          currentOperend: null,
        };
      }
      if (state.currentOperend == null) {
        return {
          ...state,
          operation: action.payload.operator,
        };
      }
      return {
        ...state,
        operation: action.payload.operator,
        previousOperend: evaluate(state),
        currentOperend: null,
      };

    case ACTIONS.EVALUATE:
      if (state.currentOperend == null && state.previousOperend == null)
        return state;
      if (state.previousOperend == null) return state;
      if (state.currentOperend == null)
        return {
          ...state,
          currentOperend: state.previousOperend,
        };

      return {
        ...state,
        previousOperend: null,
        operation: null,
        overWrite: true,
        currentOperend: evaluate(state),
      };

    case ACTIONS.DELETE:
      if (state.currentOperend == null) return state;
      if (state.overWrite) {
        return {
          ...state,
          currentOperend: null,
          overWrite: false,
        };
      }
      const len = state.currentOperend.length;
      return {
        ...state,
        currentOperend: state.currentOperend.substr(0, len - 1),
      };
  }
}

function evaluate({ currentOperend, previousOperend, operation }) {
  const prev = parseFloat(previousOperend);
  const cur = parseFloat(currentOperend);

  if (isNaN(prev) || isNaN(cur)) return "";

  let comp = "";
  switch (operation) {
    case "+":
      comp = prev + cur;
      break;
    case "-":
      comp = prev - cur;
      break;
    case "*":
      comp = prev * cur;
      break;
    case "÷":
      comp = prev / cur;
      break;
  }
  return comp.toString();
}

const intgerformater = new Intl.NumberFormat("en-us", {
  maximumFractionDigit: 0,
});
function formatOperand(operand) {
  if (operand == null) return;
  const [integer, decimal] = operand.split(".");
  if (decimal == null) return intgerformater.format(integer);

  return `${intgerformater.format(integer)}.${decimal}`;
}

function App() {
  const [{ currentOperend, previousOperend, operation }, dispatch] = useReducer(
    reducer,
    {}
  );

  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operand">
          {formatOperand(previousOperend)} {operation}
        </div>
        <div className="current-operand">{formatOperand(currentOperend)}</div>
      </div>
      <button
        className="span-two"
        onClick={() => {
          dispatch({ type: ACTIONS.CLEAR });
        }}
      >
        AC
      </button>
      <button onClick={() => dispatch({ type: ACTIONS.DELETE })}>DEL</button>
      <OperationButton operator="÷" dispatch={dispatch} />
      <DigitButton digit="1" dispatch={dispatch} />
      <DigitButton digit="2" dispatch={dispatch} />
      <DigitButton digit="3" dispatch={dispatch} />
      <OperationButton operator="*" dispatch={dispatch} />
      <DigitButton digit="4" dispatch={dispatch} />
      <DigitButton digit="5" dispatch={dispatch} />
      <DigitButton digit="6" dispatch={dispatch} />
      <OperationButton operator="+" dispatch={dispatch} />
      <DigitButton digit="7" dispatch={dispatch} />
      <DigitButton digit="8" dispatch={dispatch} />
      <DigitButton digit="9" dispatch={dispatch} />
      <OperationButton operator="-" dispatch={dispatch} />
      <DigitButton digit="." dispatch={dispatch} />
      <DigitButton digit="0" dispatch={dispatch} />
      <button
        className="span-two"
        onClick={() => {
          dispatch({ type: ACTIONS.EVALUATE });
        }}
      >
        =
      </button>
    </div>
  );
}

export default App;

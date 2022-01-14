import ExpenseDate from "./ExpenseDate";
import "./ExpenseItem.css";

function ExpenseItem(props) {
  return (
    <div className="expense-item">
      <div>{props.date}</div>
      <div className="expense-item__description">
        <h2>{props.title}</h2>
        <h3 className="expense-item__price">${props.amount}M</h3>
      </div>
    </div>
  );
}

export default ExpenseItem;

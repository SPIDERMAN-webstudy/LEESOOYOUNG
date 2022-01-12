import "./ExpenseItem.css";

function ExpenseItem() {
  const expenseDate = "Borussia Dortmund";
  const expenseTitle = "Erling Holland";
  const expenseAmount = 220;

  return (
    <div className="expense-item">
      <div>{expenseDate}</div>
      <div className="expense-item__description">
        <h2>{expenseTitle}</h2>
        <div className="expense-item__price">${expenseAmount}M</div>
      </div>
    </div>
  );
}

export default ExpenseItem;

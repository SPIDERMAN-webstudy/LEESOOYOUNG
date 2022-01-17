import React, { useState } from "react";

import ExpenseItem from "./ExpenseItem";
import Card from "../UI/Card";
import "./Expenses.css";
import ExpensesFilter from "./ExpensesFilter";

const Expenses = (props) => {
  const [year, setYear] = useState("");
  const yearChange = (elem) => {
    setYear(elem);
  };

  return (
    <Card className="expenses">
      <ExpensesFilter onYear={yearChange} />
      {props.items
        .filter((expense) => parseInt(year) === expense.date.getFullYear())
        .map((expense) => (
          <ExpenseItem
            key={expense.id}
            title={expense.title}
            amount={expense.amount}
            date={expense.date}
          />
        ))}
    </Card>
  );
};

export default Expenses;

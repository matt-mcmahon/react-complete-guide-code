import React from "react";
import { currency } from "./CurrencyValue";
import "./ExpenseItem.css";

const asUSD = currency();

export default function ExpenseItem() {
  const item = {
    date: new Date(2021, 2, 28),
    label: "Car Insurance!",
    amount: asUSD(294.67),
  };

  return (
    <div className="expense-item">
      <div>{item.date.toLocaleDateString()}</div>
      <div className="expense-item__description">
        <h2>{item.label}</h2>
        <div className="expense-item__amount">{item.amount.toString()}</div>
      </div>
    </div>
  );
}

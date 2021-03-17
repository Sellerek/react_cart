import React, { useState, useEffect } from "react";
import Cart from "../Cart/Cart";
import axios from "axios";
import "./App.css";

const App = () => {
  const [productDetails, setProductDetails] = useState([]);
  const [totalSum, setTotalSum] = useState(0);

  useEffect(() => {
    axios.get("/api/cart").then(({ data }) => {
      setProductDetails(data);
      setTotalSum(
        data
          .reduce((acc, { min, price }) => acc + min * parseFloat(price), 0)
          .toFixed(2)
      );
    });
  }, []);

  const products = productDetails.map(
    ({ isBlocked, max, min, name, pid, price }) => {
      return (
        <li key={pid} className="row">
          {name}, cena: {price.replace(/\./g, ",")} zł
          <Cart
            min={min}
            max={max}
            isBlocked={isBlocked}
            price={price}
            setTotalSum={setTotalSum}
            pid={pid}
          />
        </li>
      );
    }
  );

  return (
    <div className="container">
      <h3>Lista produktów</h3>
      <ul>{products}</ul>
      <div>
        <h3>Suma: {totalSum}</h3>
      </div>
    </div>
  );
};

export { App };

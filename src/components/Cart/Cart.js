import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { debounce } from "lodash";
import "./Cart.css";

const Cart = ({ min, max, isBlocked, price, pid, setTotalSum }) => {
  const [productCount, setProductCount] = useState(min);

  const checkProduct = useCallback(
    debounce(async quantity => {
      try {
        await axios.post("/api/product/check", { quantity, pid });
      } catch (err) {
        if (err.response.data.errorType === "INCORRECT_QUANTITY")
          setProductCount(min);
      }
    }, 500),
    []
  );

  const notInitialRender = useRef(false);

  useEffect(() => {
    if (notInitialRender.current) checkProduct(productCount);
    else notInitialRender.current = true;
  }, [productCount]);

  const changeQuantity = modifier => {
    setProductCount(prevState => prevState + modifier);
    setTotalSum(prevState => (+prevState + price * modifier).toFixed(2));
  };

  return (
    <div className="cart-wrapper">
      <button
        disabled={productCount === max || isBlocked}
        className="cart"
        onClick={() => changeQuantity(+1)}
      >
        +
      </button>
      <button
        disabled={productCount === min || isBlocked}
        className="cart"
        onClick={() => changeQuantity(-1)}
      >
        -
      </button>
      <span>
        {`Obecnie masz ${productCount}
        ${
          productCount === 1
            ? "sztukę"
            : productCount > 1 && productCount < 5
            ? "sztuki"
            : "sztuk"
        } produktu.`}
      </span>
    </div>
  );
};

export default Cart;

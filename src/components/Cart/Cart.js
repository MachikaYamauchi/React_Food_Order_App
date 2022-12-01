import React, { useContext, useState } from "react";

import classes from "./Cart.module.css";
import Modal from "../UI/Modal";
import CartItem from "./CartItem";
import CartContext from "../../store/cart-context";
import Checkout from "./Checkout";

const Cart = (props) => {
  const [isCheckout, setIdCheckout] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [didSubmit, setDidSubmit] = useState(false); // to display success message
  const cartCxt = useContext(CartContext);

  const totalAmount = `$${cartCxt.totalAmount.toFixed(2)}`;

  const hasItems = cartCxt.items.length > 0;

  const cartItemRemoveHandler = (id) => {
    cartCxt.removeItem(id);
  };

  const cartItemAddHandler = (item) => {
    cartCxt.addItem({ ...item, amount: 1 });
  };

  const orderHandler = () => {
    setIdCheckout(true);
  };

  const submitOrderHandler = async (userData) => {
    setIsSubmitting(true);
    // Extra work -> error handling
    await fetch(
      "https://food-order-app-88517-default-rtdb.firebaseio.com/orders.json",
      {
        method: "POST",
        body: JSON.stringify({
          user: userData,
          orderItems: cartCxt.items,
        }),
      }
    );
    setIsSubmitting(false);
    setDidSubmit(true);
    cartCxt.clearCart();// submit done -> clear cart
  };

  const cartItems = (
    <ul className={classes["cart-items"]}>
      {cartCxt.items.map((item) => (
        <CartItem
          key={item.id}
          name={item.name}
          price={item.price}
          amount={item.amount}
          onRemove={cartItemRemoveHandler.bind(null, item.id)}
          onAdd={cartItemAddHandler.bind(null, item)}
        />
      ))}
    </ul>
  );

  // close and order button
  const modalActions = (
    <div className={classes.actions}>
      <button className={classes["button--alt"]} onClick={props.onClose}>
        Close
      </button>
      {hasItems && (
        <button className={classes.button} onClick={orderHandler}>
          Order
        </button>
      )}
    </div>
  );

  const cartModalContent = (
    <React.Fragment>
      {cartItems}
      <div className={classes.total}>
        <span>Total Amount</span>
        <span>{totalAmount}</span>
      </div>
      {isCheckout && (
        <Checkout onConfirm={submitOrderHandler} onCancel={props.onClose} />
      )}
      {!isCheckout && modalActions}
    </React.Fragment>
  );

  // show the message while submitting
  const isSubmittingModalContent = <p>Sending order data...</p>;

  const didSubmitHandlerContent = (
    <React.Fragment>
      <p>Successfully sent the order</p>
      <div className={classes.actions}>
      <button className={classes.button} onClick={props.onClose}>
        Close
      </button>
    </div>
    </React.Fragment>
  );

  return (
    <Modal onClose={props.onClose}>
      {!isSubmitting && !didSubmit && cartModalContent}
      {isSubmitting && isSubmittingModalContent}
      {!isSubmitting && didSubmit && didSubmitHandlerContent}
    </Modal>
  );
};

export default Cart;

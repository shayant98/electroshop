import React, { useState } from "react";
import { Form, Col, Button } from "react-bootstrap";
import { savePaymentMethod } from "../actions/cartActions";
import FormContainer from "../components/FormContainer";
import { useDispatch, useSelector } from "react-redux";
import CheckoutSteps from "../components/CheckoutSteps";

const PaymentScreen = ({ history }) => {
  const dispatch = useDispatch();
  const [paymentMethod, setPaymentMethod] = useState("PayPal");

  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;
  if (!shippingAddress.address) {
    history.pushState("/shipping");
  }

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    history.push("/placeorder");
  };
  return (
    <FormContainer>
      <CheckoutSteps step1 step2 step3 />

      <h1>Payment Method</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group>
          <Form.Label as="legend">Select method</Form.Label>
          <Col>
            <Form.Check
              type="radio"
              label="paypal or credit card"
              id="PayPal"
              name="paymentMethod"
              value="PayPal"
              checked
              onChange={(e) => setPaymentMethod(e.target.value)}
            ></Form.Check>
          </Col>
        </Form.Group>
        <Button type="submit" variant="primary">
          Continue
        </Button>
      </Form>
    </FormContainer>
  );
};

export default PaymentScreen;

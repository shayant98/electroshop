import React, { useEffect, useState } from "react";
import {
  Button,
  Row,
  Col,
  ListGroup,
  Image,
  Card,
  Form,
  Badge,
} from "react-bootstrap";
import Message from "../components/Message";
import { useDispatch, useSelector } from "react-redux";
import CheckoutSteps from "../components/CheckoutSteps";
import { createOrder } from "../actions/orderActions";
import { Link } from "react-router-dom";
import { emptyCart } from "../actions/cartActions";
import { couponCodeCheck } from "../actions/saleActions";
import { getUserDetails } from "../actions/userActions";
import { SALE_COUPON_RESET } from "../constants/saleConstants";

const PlaceOrderScreen = ({ history }) => {
  const dispatch = useDispatch();

  const [coupon, setCoupon] = useState("");
  const [showCouponField, setShowCouponField] = useState(true);
  const [discount, setDiscount] = useState(0);

  const cart = useSelector((state) => state.cart);
  const { cartItems, shippingAddress, paymentMethod } = cart;

  if (!cart.shippingAddress.address) {
    history.push("/shipping");
  } else if (!cart.paymentMethod) {
    history.push("/payment");
  }

  const itemsPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  const orderCreate = useSelector((state) => state.orderCreate);
  const { success, error, order } = orderCreate;

  const saleCouponCheck = useSelector((state) => state.saleCouponCheck);
  const { success: successCoupon, error: errorCoupon, sale } = saleCouponCheck;

  const userDetails = useSelector((state) => state.userDetails);
  const { user } = userDetails;

  const shippingPrice = itemsPrice > 100 ? 0 : 750;
  const taxPrice = Number(0.15 * itemsPrice).toFixed(2);
  const totalPrice =
    Number(itemsPrice) + Number(shippingPrice) + Number(taxPrice);

  useEffect(() => {
    dispatch({ type: SALE_COUPON_RESET });
    if (success) {
      dispatch(emptyCart());
      history.push(`/order/${order._id}`);
    }
    if (successCoupon) {
      setShowCouponField(false);

      if (sale.salePercentage && sale.salePercentage !== 0) {
        setDiscount(
          (totalPrice - totalPrice * (sale.salePercentage / 100)).toFixed(2)
        );
      } else {
        setDiscount(sale.saleAmmount);
      }
      computeOrderPrice();
    }

    if (!user.name) {
      dispatch(getUserDetails("profile"));
    }
  }, [
    dispatch,
    success,
    order,
    history,
    successCoupon,
    sale,
    totalPrice,
    user,
  ]);

  const computeOrderPrice = () => {
    return (
      Number(itemsPrice) +
      Number(shippingPrice) +
      Number(taxPrice) -
      Number(discount)
    ).toFixed(2);
  };

  const couponHandler = (e) => {
    e.preventDefault();

    if (e.target.value.trim().length > 0) {
      dispatch(couponCodeCheck(e.target.value.toUpperCase()));
    }
  };

  const placeorderHandler = () => {
    dispatch(
      createOrder({
        orderItems: cartItems,
        shippingAddress,
        paymentMethod,
        shippingPrice,
        taxPrice,
        totalPrice,
      })
    );
  };

  const removeCouponHander = () => {
    dispatch({ type: SALE_COUPON_RESET });
    setDiscount(0);
    setShowCouponField(true);
  };

  return (
    <>
      {user.name && !user.isVerified && (
        <Message variant="danger">
          Please Verify your account to place purchase
        </Message>
      )}
      <CheckoutSteps step1 step2 step3 step4 />
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Address:</strong> {shippingAddress.address},{" "}
                {shippingAddress.city}, {shippingAddress.postalCode},{" "}
                {shippingAddress.country},
              </p>
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment Method</h2>
              <strong>Method:</strong>
              {paymentMethod}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Order Items:</h2>
              {cartItems.length === 0 ? (
                <Message>Your cart is empty</Message>
              ) : (
                <ListGroup variant="flush">
                  {cartItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} x ${item.price} = ${item.qty * item.price}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup>
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items:</Col>
                  <Col>${itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping:</Col>
                  <Col>${shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax:</Col>
                  <Col>${taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Discount:</Col>
                  <Col>${discount}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total:</Col>
                  <Col>${computeOrderPrice()}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                {error && <Message variant="danger">{error}</Message>}
                {errorCoupon && (
                  <Message variant="danger">{errorCoupon}</Message>
                )}
                {!showCouponField && (
                  <Badge pill variant="primary">
                    {coupon.toUpperCase()}{" "}
                    <Button onClick={removeCouponHander}>
                      <i className="fas fa-times" />
                    </Button>
                  </Badge>
                )}
              </ListGroup.Item>
              <ListGroup.Item>
                <Form>
                  {showCouponField && (
                    <Form.Group onSubmit={(e) => couponHandler(e)}>
                      <Form.Control
                        placeholder="Enter Coupon"
                        value={coupon}
                        onChange={(e) => setCoupon(e.target.value)}
                        onBlur={(e) => couponHandler(e)}
                      ></Form.Control>
                    </Form.Group>
                  )}
                </Form>
              </ListGroup.Item>
              <ListGroup.Item>
                <Button
                  type="button"
                  className="btn-block"
                  disabled={cartItems === 0 || !user.isVerified}
                  onClick={placeorderHandler}
                >
                  Place Order
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default PlaceOrderScreen;

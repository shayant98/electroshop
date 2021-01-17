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
import { useSelector } from "react-redux";
import CheckoutSteps from "../components/CheckoutSteps";
import { Link } from "react-router-dom";
import { fetchProfile } from "../services/userService";
import { useMutation, useQuery } from "react-query";
import { createOrder } from "../services/orderService";
import { fetchCoupon } from "../services/saleService";

const PlaceOrderScreen = ({ history }) => {
  const [coupon, setCoupon] = useState("");
  const [showCouponField, setShowCouponField] = useState(true);
  const [discount, setDiscount] = useState(0);

  const cart = useSelector((state) => state.cart);
  const { cartItems, shippingAddress, paymentMethod } = cart;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const { data: user, isFetched: userIsFetched } = useQuery(
    ["profile", userInfo.token],
    fetchProfile
  );

  const {
    data: sale,
    refetch,
    isError: couponHasError,
    error: couponError,
    isSuccess: couponIsSuccess,
  } = useQuery(["coupon", coupon, userInfo.token], fetchCoupon, {
    enabled: true,
  });

  useEffect(() => {
    if (!shippingAddress.address) {
      history.push("/shipping");
    } else if (!paymentMethod) {
      history.push("/payment");
    }
  }, [shippingAddress, paymentMethod, history]);

  const itemsPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  const createOrderMut = useMutation(createOrder);

  const shippingPrice = itemsPrice > 100 ? 0 : 750;
  const taxPrice = Number(0.15 * itemsPrice).toFixed(2);
  const totalPrice =
    Number(itemsPrice) + Number(shippingPrice) + Number(taxPrice);

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
      refetch();
      if (couponIsSuccess) {
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
    }
  };

  const placeorderHandler = () => {
    const order = {
      orderItems: cartItems,
      shippingAddress,
      paymentMethod,
      shippingPrice,
      taxPrice,
      totalPrice,
    };

    createOrderMut.mutate(
      { token: userInfo.token, order },
      {
        onSuccess: (data) => {
          history.push(`/order/${data._id}`);
        },
      }
    );
  };

  const removeCouponHander = () => {
    setDiscount(0);
    setShowCouponField(true);
  };

  return (
    <>
      {userIsFetched && !user.isVerified && (
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
                {createOrderMut.isError && (
                  <Message variant="danger">
                    {createOrderMut.error.message}
                  </Message>
                )}
                {couponHasError && (
                  <Message variant="danger">{couponError.message}</Message>
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
                  disabled={
                    cartItems === 0 || (userIsFetched && !user.isVerified)
                  }
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

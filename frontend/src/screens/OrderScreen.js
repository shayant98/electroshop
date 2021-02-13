import React from "react";
import { Row, Col, ListGroup, Image, Card, Button } from "react-bootstrap";
import Message from "../components/Message";
import { useSelector } from "react-redux";
import { useQuery, useMutation, useQueryClient } from "react-query";
import Loader from "../components/Loader";

import { Link } from "react-router-dom";
import { PayPalButton } from "react-paypal-button-v2";

import {
  fetchOrder,
  markOrderAsDeliverd,
  markOrderAsPaid,
} from "../services/orderService";
import { fetchPayPalToken } from "../services/saleService";

const OrderScreen = ({ match }) => {
  const orderId = match.params.id;
  const queryClient = useQueryClient();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const payOrderMut = useMutation(markOrderAsPaid, {
    onSuccess: (data) => {
      queryClient.fetchQuery(["order", orderId, userInfo.token], fetchOrder);
    },
  });

  const deliverOrderMut = useMutation(markOrderAsDeliverd, {
    onSuccess: (data) => {
      queryClient.fetchQuery(["order", orderId, userInfo.token], fetchOrder);
    },
  });
  const { data: order, isError, error, isLoading: orderIsLoading } = useQuery(
    ["order", orderId, userInfo.token],
    fetchOrder
  );
  const { data: clientId, isFetched, isSuccess } = useQuery(
    "paypal",
    fetchPayPalToken
  );

  const addPayPalScript = (clientId) => {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`;
    script.async = true;
    document.body.appendChild(script);
  };

  if (!window.paypal && isFetched && isSuccess) {
    addPayPalScript(clientId);
  }

  if (!orderIsLoading && order) {
    order.itemsPrice = order.orderItems.reduce(
      (acc, item) => acc + item.price * item.qty,
      0
    );
  }

  const successPaymentHandler = (paymentResult) => {
    payOrderMut.mutate({ id: orderId, paymentResult, token: userInfo.token });
  };

  const deliverHandler = () => {
    deliverOrderMut.mutate({
      id: orderId,
      token: userInfo.token,
    });
  };

  return orderIsLoading ? (
    <Loader />
  ) : isError ? (
    <Message variant="danger">{error.message}</Message>
  ) : (
    <>
      <h1> Order {order._id}</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Name: </strong>
                {order.user.name}
              </p>
              <p>
                <strong>Email: </strong>
                <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
              </p>
              <p>
                <strong>Address:</strong> {order.shippingAddress.address},{" "}
                {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                , {order.shippingAddress.country},
              </p>
              {order.isDelivered ? (
                <Message variant="success">
                  Delivered on {order.deliveredAt}
                </Message>
              ) : (
                <Message variant="danger">Not Delivered</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>
                <strong>Method:</strong>
                {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <Message variant="success">Paid on {order.paidAt}</Message>
              ) : (
                <Message variant="danger">Not Paid</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Order Items:</h2>
              {order.orderItems.length === 0 ? (
                <Message>Your cart is empty</Message>
              ) : (
                <ListGroup variant="flush">
                  {order.orderItems.map((item, index) => (
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
                  <Col>${order.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping:</Col>
                  <Col>${order.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax:</Col>
                  <Col>${order.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total:</Col>
                  <Col>${order.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
            </ListGroup>
          </Card>
          {!order.isPaid && userInfo._id === order.user._id && (
            <Col className="mt-3">
              {payOrderMut.isLoading && <Loader />}
              {!isSuccess ? (
                <Loader />
              ) : (
                <>
                  <PayPalButton
                    style={{
                      color: "white",
                      size: "medium",
                      shape: "rect",
                      label: "checkout",
                    }}
                    amount={order.totalPrice}
                    onSuccess={successPaymentHandler}
                  />
                </>
              )}
            </Col>
          )}
          {userInfo.isAdmin && order.isPaid && !order.isDelivered && (
            <Col className="mt-3">
              <Button
                type="button"
                className="btn btn-blcok"
                onClick={deliverHandler}
              >
                Mark as delivered
              </Button>
            </Col>
          )}
        </Col>
      </Row>
    </>
  );
};

export default OrderScreen;

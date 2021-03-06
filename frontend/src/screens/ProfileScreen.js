import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col, Table } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { fetchProfile, updateProfile } from "../services/userService";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { fetchMyOrders } from "../services/orderService";

const ProfileScreen = ({ history }) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);

  const queryClient = useQueryClient();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const { data: user, isLoading, isError, error } = useQuery(
    ["profile", userInfo.token],
    fetchProfile
  );
  const {
    data: orders,
    isLoading: orderIsLoading,
    error: orderError,
  } = useQuery(["my-orders", userInfo.token], fetchMyOrders);

  const userUpdateMut = useMutation(updateProfile, {
    onSuccess: (data, variable, con) => {
      queryClient.invalidateQueries(["profile", variable.token]);
      setMessage("User successfully updated");
    },
  });

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
    } else {
      userUpdateMut.mutate({
        user: { id: user._id, name, email, password },
        token: userInfo.token,
      });
    }
  };

  return (
    <>
      {user && !user.isVerified && (
        <Message variant="danger">Please Verify your account</Message>
      )}
      <Row>
        <Col md={3}>
          <h2>User profile</h2>
          {message && <Message variant="danger">{message}</Message>}

          {isError && <Message variant="danger">{error.message}</Message>}

          {isLoading && <Loader />}
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="email">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="passwors">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="confirmPassword">
              <Form.Label>repeat password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Cofirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Button type="submit" variant="primary">
              Update
            </Button>
          </Form>
        </Col>
        <Col md={9}>
          <h2>My Orders</h2>
          {orderIsLoading ? (
            <Loader />
          ) : orderError ? (
            <Message variant="danger">{orderError.message}</Message>
          ) : (
            <Table striped bordered responsive className="table-sm">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>DATE</th>
                  <th>TOTAL</th>
                  <th>PAID</th>
                  <th>DELIVERED</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td>{order._id}</td>
                    <td>{order.createdAt.substring(0, 10)}</td>
                    <td>{order.totalPrice}</td>
                    <td>
                      {order.isPaid ? (
                        order.paidAt.substring(0, 10)
                      ) : (
                        <i className="fas fa-times" style={{ color: "red" }} />
                      )}
                    </td>
                    <td>
                      {order.isDelivered ? (
                        order.deliveredAt?.substring(0, 10)
                      ) : (
                        <i className="fas fa-times" style={{ color: "red" }} />
                      )}
                    </td>
                    <td>
                      <LinkContainer to={`/order/${order._id}`}>
                        <Button variant="light">Details</Button>
                      </LinkContainer>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Col>
      </Row>
    </>
  );
};

export default ProfileScreen;

import React, { useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { Link } from "react-router-dom";
import FormContainer from "../components/FormContainer";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { fetchSale, updateSale } from "../services/saleService";

const SaleEditScreen = ({ history, match }) => {
  const saleId = match.params.id;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const [name, setName] = useState("");
  const [startsOn, setStartsOn] = useState("");
  const [endsOn, setEndsOn] = useState("");
  const [coupon, setCoupon] = useState("");
  const [percentage, setPercentage] = useState(0);
  const [ammount, setAmmount] = useState(0);
  const [isActive, setIsActive] = useState(false);

  const queryClient = useQueryClient();

  const { isLoading, error, data: sale, isError } = useQuery(
    ["sale", saleId, userInfo.token],
    fetchSale
  );

  useEffect(() => {
    if (sale) {
      setName(sale.name);
      setCoupon(sale.couponCode);
      setAmmount(sale.saleAmmount);
      setIsActive(sale.isActive);
      setPercentage(sale.salePercentage);
      setStartsOn(sale.startsOn);
      setEndsOn(sale.endsOn);
    }
  }, [sale]);

  const updateSaleMut = useMutation(updateSale, {
    onSuccess: (data, variables, context) => {
      queryClient.refetchQueries("sales");
      history.push(`/admin/saleslist`);
    },
  });

  const submitHandler = (e) => {
    e.preventDefault();
    const sale = {
      _id: saleId,
      name,
      coupon,
      startsOn,
      endsOn,
      isActive,
      percentage,
      ammount,
    };
    updateSaleMut.mutate({ token: userInfo.token, sale });
  };

  return (
    <>
      <Link to="/admin/saleslist" className="btn btn-light my-3">
        Go Back
      </Link>
      <FormContainer>
        <h1>Edit Sale</h1>
        {updateSaleMut.isLoading && <Loader />}
        {updateSaleMut.isError && <Message variant="danger">{isError}</Message>}

        {isLoading ? (
          <Loader />
        ) : isError ? (
          <Message variant="danger">{error.message}</Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Col>
              <Form.Group controlId="name">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                ></Form.Control>
              </Form.Group>
              <Form.Group controlId="coupon">
                <Form.Label>coupon</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter coupon"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                ></Form.Control>
              </Form.Group>
              <Row>
                <Col>
                  <Form.Group controlId="startDate">
                    <Form.Label>Start Date </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter start date"
                      value={startsOn}
                      onChange={(e) => setStartsOn(e.target.value)}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="endDate">
                    <Form.Label>End Date </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter end date"
                      value={endsOn}
                      onChange={(e) => setEndsOn(e.target.value)}
                    ></Form.Control>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group controlId="percentage">
                    <Form.Label>percentage</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="Enter Percentage"
                      value={percentage}
                      onChange={(e) => setPercentage(e.target.value)}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="ammount">
                    <Form.Label>ammount</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="Enter Ammount"
                      value={ammount}
                      onChange={(e) => setAmmount(e.target.value)}
                    ></Form.Control>
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group controlId="isActive">
                <Form.Check
                  type="checkbox"
                  label="is Active"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                ></Form.Check>
              </Form.Group>
              <Button type="submit" variant="primary">
                Update
              </Button>
            </Col>
          </Form>
        )}
      </FormContainer>
    </>
  );
};

export default SaleEditScreen;

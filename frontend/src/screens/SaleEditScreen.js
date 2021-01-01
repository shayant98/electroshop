import React, { useEffect, useState } from "react";
import { Button, Col, Form, Row, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { getSaleDetails, updateSale } from "../actions/saleActions";

import Message from "../components/Message";
import Loader from "../components/Loader";
import { Link } from "react-router-dom";
import FormContainer from "../components/FormContainer";
import { SALE_UPDATE_RESET } from "../constants/saleConstants";
import { listProducts } from "../actions/productActions";

const SaleEditScreen = ({ history, match }) => {
  const pageNumber = match.params.pageNumber || 1;
  const saleId = match.params.id;

  const [name, setName] = useState("");
  const [startsOn, setStartsOn] = useState("");
  const [endsOn, setEndsOn] = useState("");
  const [coupon, setCoupon] = useState("");
  const [percentage, setPercentage] = useState(0);
  const [ammount, setAmmount] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [productCheck, setProductCheck] = useState({});

  const dispatch = useDispatch();

  const productList = useSelector((state) => state.productList);
  const { products } = productList;

  const saleDetail = useSelector((state) => state.saleDetail);
  const { loading, error, sale } = saleDetail;

  const saleUpdate = useSelector((state) => state.saleUpdate);
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = saleUpdate;

  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: SALE_UPDATE_RESET });
      history.push("/admin/saleslist");
    } else {
      if (!sale || sale._id !== saleId) {
        dispatch(getSaleDetails(saleId));
        dispatch(listProducts("", pageNumber));

        // if (!products) {
        //   dispatch(listProducts("", pageNumber));
        // }
      } else {
        setName(sale.name);
        setCoupon(sale.couponCode);
        setAmmount(sale.saleAmmount);
        setPercentage(sale.salePercentage);
        setStartsOn(sale.startsOn);
        setEndsOn(sale.endsOn);
      }
    }
  }, [saleId, sale, dispatch, successUpdate, history]);

  const submitHandler = (e) => {
    e.preventDefault();
    const sale = {
      _id: saleId,
      name,
      coupon,
      startsOn,
      endsOn,
      isActive,
      products: productCheck,
      percentage,
      ammount,
    };
    dispatch(updateSale(sale));
  };

  return (
    <>
      <Link to="/admin/saleslist" className="btn btn-light my-3">
        Go Back
      </Link>
      <FormContainer>
        <h1>Edit Sale</h1>
        {loadingUpdate && <Loader />}
        {errorUpdate && <Message variant="danger">{errorUpdate}</Message>}

        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
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

              <Table>
                <thead>
                  <tr>
                    <th></th>
                    <th>NAME</th>
                    <th>CATEGORY</th>
                    <th>BRAND</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product._id}>
                      <td>
                        <Form.Group controlId={product._id}>
                          <Form.Check
                            type="checkbox"
                            name={product._id}
                            checked={productCheck[product._id]}
                            onChange={(e) =>
                              setProductCheck({
                                ...productCheck,
                                [e.target.name]: e.target.checked,
                              })
                            }
                          ></Form.Check>
                        </Form.Group>
                      </td>
                      <td>{product.name}</td>
                      <td>{product.category}</td>
                      <td>{product.brand}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
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

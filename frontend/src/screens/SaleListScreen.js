import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Button, Col, Row, Table } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { createSale, deleteSale, listSales } from "../actions/saleActions";
import { SALE_CREATE_RESET } from "../constants/saleConstants";

const SaleListScreen = ({ history }) => {
  const dispatch = useDispatch();

  const saleList = useSelector((state) => state.saleList);
  const { error, loading, sales } = saleList;

  const saleDelete = useSelector((state) => state.saleDelete);
  const {
    error: errorDelete,
    loading: loadingDelete,
    success: successDelete,
  } = saleDelete;

  const saleCreate = useSelector((state) => state.saleCreate);
  const {
    error: errorCreate,
    loading: loadingCreate,
    success: successCreate,
    sale: createdSale,
  } = saleCreate;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    dispatch({ type: SALE_CREATE_RESET });

    if (!userInfo.isAdmin) {
      history.push("/");
    }

    if (successCreate) {
      history.push(`/admin/sales/${createdSale._id}/edit`);
    } else {
      dispatch(listSales());
    }
  }, [dispatch, userInfo, successDelete, history, successCreate, createdSale]);

  const deleteHandler = (id) => {
    if (window.confirm("are you sure")) {
      dispatch(deleteSale(id));
    }
  };
  const createSaleHandler = () => {
    dispatch(createSale());
  };
  return (
    <>
      <Row className="align-items-center">
        <Col>
          <h1>Sales</h1>
        </Col>
        <Col className="text-right">
          <Button className="my-3" onClick={createSaleHandler}>
            <i className="fas fa-plus" /> Create Sale
          </Button>
        </Col>
      </Row>

      {loadingCreate && <Loader />}
      {errorCreate && <Message variant="danger">{errorCreate}</Message>}
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          {loadingDelete && <Loader />}
          {errorDelete && <Message variant="danger">{errorDelete}</Message>}
          <Table>
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>START</th>
                <th>END</th>
                <th>Active</th>
                <th>Sales Percentage</th>
                <th>Sales Ammount</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {sales.map((sale) => (
                <tr key={sale._id}>
                  <td>{sale._id}</td>
                  <td>{sale.name}</td>
                  <td>{sale.startsOn.substring(0, 10)}</td>
                  <td>{sale.endsOn.substring(0, 10)}</td>
                  <td>
                    {sale.isActive ? (
                      <i className="fas fa-check" style={{ color: "green" }} />
                    ) : (
                      <i className="fas fa-times" style={{ color: "red" }} />
                    )}
                  </td>
                  <td>{sale.salePercentage}</td>
                  <td>{sale.saleAmmount}</td>
                  <td>
                    <LinkContainer to={`/admin/sale/${sale._id}/edit`}>
                      <Button variant="light" className="btn-sm">
                        <i className="fas fa-edit" />
                      </Button>
                    </LinkContainer>
                    <Button
                      variant="danger"
                      className="btn-sm"
                      onClick={() => deleteHandler(sale._id)}
                    >
                      <i className="fas fa-trash" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}
    </>
  );
};

export default SaleListScreen;

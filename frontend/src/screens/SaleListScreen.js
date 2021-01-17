import React from "react";
import { useSelector } from "react-redux";

import { Button, Col, Row, Table } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { fetchSales, deleteSale, createSale } from "../services/saleService";
import { useMutation, useQuery, useQueryClient } from "react-query";

const SaleListScreen = ({ history }) => {
  const queryClient = useQueryClient();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const { isLoading, error, data: sales, isError } = useQuery(
    ["sales", userInfo.token],
    fetchSales
  );

  const deleteSaleMut = useMutation(deleteSale, {
    onSuccess: (data, variables, context) => {
      queryClient.refetchQueries(["sales", userInfo.token]);
    },
  });
  const createSaleMut = useMutation(createSale, {
    onSuccess: (data) => {
      history.push(`/admin/sale/${data._id}/edit`);
    },
  });

  const deleteHandler = (id) => {
    if (window.confirm("are you sure")) {
      deleteSaleMut.mutate({ id, token: userInfo.token });
    }
  };
  const createSaleHandler = () => {
    createSaleMut.mutate({ token: userInfo.token });
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

      {createSaleMut.isLoading && <Loader />}
      {createSaleMut.isError && (
        <Message variant="danger">{createSaleMut.error.message}</Message>
      )}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          {isError && <Message variant="danger">{error.message}</Message>}
          <Table>
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>START</th>
                <th>END</th>
                <th>ACTIVE</th>
                <th>SALE</th>
                <th>COUPON</th>
                <th>AFFECTED PRODUCTS</th>
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
                  <td>
                    {sale.salePercentage !== 0
                      ? `${sale.salePercentage}%`
                      : sale.saleAmmount !== 0
                      ? `$${sale.saleAmmount}`
                      : 0}
                  </td>
                  <td>{sale.couponCode}</td>
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

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Button, Table } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { deleteSale, listSales } from "../actions/saleActions";

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

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      dispatch(listSales());
    } else {
      history.push("/");
    }
  }, [dispatch, userInfo, successDelete, history]);

  const deleteHandler = (id) => {
    dispatch(deleteSale(id));
  };

  return (
    <>
      <h1>Users</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
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
            {sales.map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.name}</td>
                <td>{user.startsOn.substring(0, 10)}</td>
                <td>{user.endsOn.substring(0, 10)}</td>
                <td>
                  {user.isActive ? (
                    <i className="fas fa-check" style={{ color: "green" }} />
                  ) : (
                    <i className="fas fa-times" style={{ color: "red" }} />
                  )}
                </td>
                <td>{user.salePercentage}</td>
                <td>{user.saleAmmount}</td>
                <td>
                  <LinkContainer to={`/admin/user/${user._id}/edit`}>
                    <Button variant="light" className="btn-sm">
                      <i className="fas fa-edit" />
                    </Button>
                  </LinkContainer>
                  {user._id !== userInfo._id && (
                    <Button
                      variant="danger"
                      className="btn-sm"
                      onClick={() => deleteHandler(user._id)}
                    >
                      <i className="fas fa-trash" />
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default SaleListScreen;

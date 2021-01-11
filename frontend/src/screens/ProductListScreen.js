import React from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Table, Button, Row, Col } from "react-bootstrap";
import { useSelector } from "react-redux";

import Message from "../components/Message";
import Loader from "../components/Loader";
import Paginate from "../components/Paginate";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  createProduct,
  deleteProduct,
  fetchAllProducts,
} from "../services/productServices";

const ProductListScreen = ({ match, history }) => {
  const pageNumber = match.params.pageNumber || 1;
  const queryClient = useQueryClient();

  const { isLoading, isError, error, data, isFetching } = useQuery(
    ["products", pageNumber],
    fetchAllProducts,
    {
      keepPreviousData: true,
    }
  );

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const deleteProductMut = useMutation(deleteProduct, {
    onSuccess: (data, variables, context) => {
      queryClient.fetchQuery(["products", pageNumber], fetchAllProducts);
    },
  });
  const createProductMut = useMutation(createProduct, {
    onSuccess: (data, variables, context) => {
      history.push(`/admin/product/${data._id}/edit`);
    },
  });

  const createProductHandler = () => {
    createProductMut.mutate({ token: userInfo.token });
  };

  const deleteHandler = (id) => {
    deleteProductMut.mutate({ id, token: userInfo.token });
  };

  return (
    <>
      <Row className="align-items-center">
        <Col>
          <h1>Products</h1>
        </Col>
        <Col className="text-right">
          <Button className="my-3" onClick={createProductHandler}>
            <i className="fas fa-plus" /> Create Product
          </Button>
        </Col>
      </Row>
      {deleteProductMut.isLoading && <Loader />}
      {deleteProductMut.isError && (
        <Message variant="danger">{deleteProductMut.error.message}</Message>
      )}
      {createProductMut.isLoading && <Loader />}
      {createProductMut.isError && (
        <Message variant="danger">{createProductMut.error.message}</Message>
      )}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Table>
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>PRICE</th>
                <th>CATEGORY</th>
                <th>BRAND</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.products.map((product) => (
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>{product.name}</td>
                  <td>${product.price}</td>
                  <td>{product.category}</td>
                  <td>{product.brand}</td>
                  <td>
                    <LinkContainer to={`/admin/product/${product._id}/edit`}>
                      <Button variant="light" className="btn-sm">
                        <i className="fas fa-edit" />
                      </Button>
                    </LinkContainer>
                    <Button
                      variant="danger"
                      className="btn-sm"
                      onClick={() => deleteHandler(product._id)}
                    >
                      <i className="fas fa-trash" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Paginate
            pages={data.pages}
            page={data.page}
            currentPage="productlist"
          />
        </>
      )}
    </>
  );
};

export default ProductListScreen;

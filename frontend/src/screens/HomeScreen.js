import React from "react";
import { Link } from "react-router-dom";
import Product from "../components/Product";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { Row, Col } from "react-bootstrap";
import Paginate from "../components/Paginate";
import ProductCarousel from "../components/ProductCarousel";
import Meta from "../components/Meta";
import { useQuery } from "react-query";
import { fetchAllProducts } from "../services/productServices";
const HomeScreen = ({ match }) => {
  const keyword = match.params.keyword;
  const pageNumber = match.params.pageNumber || 1;

  const { isLoading, isError, error, data, isFetching } = useQuery(
    ["products", pageNumber, keyword],
    fetchAllProducts,
    {
      keepPreviousData: true,
    }
  );

  return (
    <>
      <Meta />
      {!keyword ? (
        <ProductCarousel />
      ) : (
        <Link to={"/"} className="btn btn-light">
          Go back
        </Link>
      )}
      <h1>Latest products</h1>
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Message variant="danger" children={error.message}></Message>
      ) : (
        <>
          {isFetching ? (
            <Loader />
          ) : (
            <Row>
              {data.products.length === 0 ? (
                <Message>No products found</Message>
              ) : (
                data.products.map((product) => (
                  <Col key={product._id} sm={12} md={6} lg={3} xl={3}>
                    <Product product={product} />
                  </Col>
                ))
              )}
            </Row>
          )}

          <Paginate
            pages={data.pages}
            page={data.page}
            currentPage={keyword ? "search" : "home"}
            keyword={keyword}
          />
        </>
      )}
    </>
  );
};

export default HomeScreen;

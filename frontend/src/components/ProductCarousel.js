import React, { useEffect } from "react";
import { Carousel, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import Loader from "./Loader";
import Message from "./Message";
import { useQuery } from "react-query";
import { fetchTopRatedProducts } from "../services/productServices";

const ProductCarousel = () => {
  const { isLoading, data: products, isError, error } = useQuery(
    "top-products",
    fetchTopRatedProducts
  );

  return isLoading ? (
    <Loader />
  ) : isError ? (
    <Message variant="danger">{error.message}</Message>
  ) : (
    <Carousel pause="hover" className="bg-dark">
      {products.map((product) => (
        <Carousel.Item key={product._id}>
          <Link to={`/product/${product._id}`}>
            <Image src={product.image} alt={product.name} fluid />
            <Carousel.Caption className="carousel-caption">
              <h2>
                {product.name} (${product.price})
              </h2>
            </Carousel.Caption>
          </Link>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default ProductCarousel;

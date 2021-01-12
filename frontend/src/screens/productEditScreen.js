import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import FormContainer from "../components/FormContainer";
import { useMutation, useQuery } from "react-query";
import {
  fetchProduct,
  updateProduct,
  uploadImage,
} from "../services/productServices";

const ProductEditScreen = ({ match, history }) => {
  const productId = match.params.id;

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);
  const [validationError, setValidationError] = useState("");

  const { data: product, isLoading, isError, error } = useQuery(
    ["product", match.params.id],
    fetchProduct
  );
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const productUpdateMut = useMutation(updateProduct, {
    onSuccess: (data, variable, con) => {
      history.push("/admin/productlist");
    },
  });

  const uploadImageMut = useMutation(uploadImage, {
    onMutate: () => {
      setUploading(true);
    },
    onError: () => {
      setUploading(false);
    },
    onSuccess: (data, variables, context) => {
      setUploading(false);
      setImage(data);
      setUploading(false);
    },
  });

  const uploadFileHandler = async (e) => {
    const image = e.target.files[0];
    uploadImageMut.mutate({ image, token: userInfo.token });
  };
  useEffect(() => {
    if (product) {
      setName(product.name);
      setPrice(product.price);
      setImage(product.image);
      setBrand(product.brand);
      setCategory(product.category);
      setCountInStock(product.countInStock);
      setDescription(product.description);
    }
  }, [product]);

  const submitHandler = (e) => {
    e.preventDefault();

    if (countInStock < 0) {
      setValidationError("Invalid stock");
      return;
    }

    productUpdateMut.mutate({
      product: {
        _id: productId,
        name,
        price,
        image,
        brand,
        category,
        description,
        countInStock,
      },
      token: userInfo.token,
    });
  };

  return (
    <>
      <Link to="/admin/productlist" className="btn btn-light my-3">
        Go Back
      </Link>
      <FormContainer>
        <h1>Edit Product</h1>
        {productUpdateMut.isLoading && <Loader />}
        {productUpdateMut.isError && (
          <Message variant="danger">{productUpdateMut.error.message}</Message>
        )}
        {validationError && (
          <Message variant="danger">{validationError}</Message>
        )}
        {isLoading ? (
          <Loader />
        ) : isError ? (
          <Message variant="danger">{error.message}</Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="name"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="price">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="image">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter image url"
                value={image}
                onChange={(e) => setImage(e.target.value)}
              ></Form.Control>
              <Form.File
                id="image-file"
                label="Choose File"
                custom
                onChange={uploadFileHandler}
              ></Form.File>
              {uploading && <Loader />}
            </Form.Group>

            <Form.Group controlId="brand">
              <Form.Label>Brand</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter brand"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="countInStock">
              <Form.Label>Count In Stock</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter countInStock"
                value={countInStock}
                onChange={(e) => setCountInStock(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="category">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Button type="submit" variant="primary">
              Update
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  );
};

export default ProductEditScreen;

import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";

import Message from "../components/Message";
import { useMutation, useQueryClient } from "react-query";
import { createProductReview, fetchProduct } from "../services/productServices";

const ReviewForm = ({ productId, token }) => {
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const createReview = useMutation(createProductReview, {
    onSuccess: (data, variables, context) => {
      queryClient.fetchQuery(["product", productId], fetchProduct);
    },
  });

  const submitHandler = (e) => {
    e.preventDefault();
    createReview.mutate({ productId, review: { rating, comment }, token });
  };

  return (
    <>
      <h2>Write a Customer Review</h2>
      {createReview.isLoading && (
        <Message variant="info">Adding review</Message>
      )}
      {createReview.isError && (
        <Message variant="danger">{createReview.error.message}</Message>
      )}
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="rating">
          <Form.Label>Rating</Form.Label>
          <Form.Control
            as="select"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
          >
            <option value="">Select...</option>
            <option value="1">1 - Poor</option>
            <option value="2">2 - Fair</option>
            <option value="3">3 - Good</option>
            <option value="4">4 - Very good</option>
            <option value="5">5 - Excellent1</option>
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="comment">
          <Form.Label>Comment</Form.Label>
          <Form.Control
            as="textarea"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Button type="submit" variant="primary">
          Submit
        </Button>
      </Form>
    </>
  );
};

export default ReviewForm;

import React from "react";
import { Pagination } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

const Paginate = ({ pages, page, currentPage, keyword = "" }) => {
  const computeTo = (pageCount) => {
    switch (currentPage) {
      case "home":
        return `/page/${pageCount + 1}`;
      case "search":
        return `/search/${keyword}/page/${pageCount + 1}`;
      case "productlist":
        return `/admin/productlist/${pageCount + 1}`;

      default:
        return `/page/${pageCount + 1}`;
    }
  };

  return (
    pages > 1 && (
      <Pagination>
        {[...Array(pages).keys()].map((pageCount) => (
          <LinkContainer key={pageCount + 1} to={computeTo(pageCount)}>
            <Pagination.Item active={pageCount + 1 === page}>
              {pageCount + 1}
            </Pagination.Item>
          </LinkContainer>
        ))}
      </Pagination>
    )
  );
};

export default Paginate;

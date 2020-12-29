import React from "react";
import { Pagination } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

const Paginate = ({ pages, page, isAdmin = false, keyword = "" }) => {
  return (
    pages > 1 && (
      <Pagination>
        {[...Array(pages).keys()].map((pageCount) => (
          <LinkContainer
            key={pageCount + 1}
            to={
              !isAdmin
                ? keyword
                  ? `/search/${keyword}/page/${pageCount + 1}`
                  : `/page/${pageCount + 1}`
                : `/admin/productlist/${pageCount + 1}`
            }
          >
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

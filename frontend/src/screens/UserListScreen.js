import React from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Table, Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useQuery, useMutation, useQueryClient } from "react-query";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { deleteUser, fetchUsers } from "../services/userService";

const UserListScreen = () => {
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const queryClient = useQueryClient();

  const userDeleteMut = useMutation(deleteUser, {
    onSuccess: (data, variables, context) => {
      queryClient.fetchQuery(["users", userInfo.token], fetchUsers);
    },
  });

  const { data: users, isLoading, isError, error } = useQuery(
    ["users", userInfo.token],
    fetchUsers
  );

  const deleteHandler = (id) => {
    if (window.confirm("are you sure")) {
      userDeleteMut.mutate({ id, token: userInfo.token });
    }
  };
  return (
    <>
      <h1>Users</h1>
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Message variant="danger">{error.message}</Message>
      ) : (
        <Table>
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>EMAIL</th>
              <th>ADMIN</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.name}</td>
                <td>
                  <a href={`mailtp:${user.email}`}>{user.email}</a>
                </td>
                <td>
                  {user.isAdmin ? (
                    <i className="fas fa-check" style={{ color: "green" }} />
                  ) : (
                    <i className="fas fa-times" style={{ color: "red" }} />
                  )}
                </td>
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

export default UserListScreen;

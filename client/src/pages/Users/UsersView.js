import React, { useState, useEffect } from "react";
import axios from "../../api/axios";
import UserAdd from "./UserAdd";

const VIEW_USERS_URL = "/users/view/all";

export default function UsersView() {
  const [users, setUsers] = useState([]);

  // toggle user add form
  const [isShowAddUser, setIsShowAddUser] = useState(false);

  const handleAddUserClick = () => {
    setIsShowAddUser((isShowLogin) => !isShowLogin);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async (e) => {
    // e.preventDefault();
    try {
      const response = await axios.get(VIEW_USERS_URL);

      console.log(response);

      setUsers(response.data);
    } catch (err) {
      // TODO: Add better error handling when loading users
      console.log(err);
    }
  };

  return (
    <div>
      <button onClick={handleAddUserClick}>New User</button>
      {isShowAddUser && <UserAdd />}
      <table>
        <tr>
          <th>id</th>
          <th>email</th>
        </tr>
        <tr>
          {users.map((user, index) => (
            <tr key={index}>
              <td>{user.id}</td>
              <td>
                <a href="/">{user.email}</a>
              </td>
            </tr>
          ))}
          <td></td>
        </tr>
      </table>
    </div>
  );
}

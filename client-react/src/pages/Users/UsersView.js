import React, { useState, useEffect } from "react";
import axios from "../../api/axios";

const VIEW_USERS_URL = "/users/view/all";

export default function UsersView() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async (e) => {
    // e.preventDefault();
    const response = await axios.get(VIEW_USERS_URL);

    console.log(response);

    setUsers(response.data);
  };

  return (
    <div>
      <button>New User</button>
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

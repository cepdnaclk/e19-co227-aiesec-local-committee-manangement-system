import Login from "./pages/Login/Login";
import UsersView from "./pages/Users/UsersView";

import { Routes, Route, Link } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
            <Link to="/login">Login</Link>
            <Link to="/users">Users</Link>
          </li>
        </ul>
      </nav>
      <Routes>
        <Route path="/" element={<h1>Home</h1>} />
        <Route path="/login" element={<Login />} />
        <Route path="/users" element={<UsersView />} />
      </Routes>
    </div>
  );
}

export default App;

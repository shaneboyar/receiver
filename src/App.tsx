import React, { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { ToastContainer, toast } from "react-toastify";
import logo from "./logo.svg";
import "react-toastify/dist/ReactToastify.css";

interface User {
  username: string;
  id: string;
}

interface Notification {
  message: string;
}

const App = () => {
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [socket, setSocket] = useState<Socket>();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (user && !socket) {
      const socket = io("http://localhost:3001");
      setSocket(socket);
    }
    return () => {
      socket?.close();
    };
  }, [socket, user]);

  useEffect(() => {
    if (socket) {
      socket.emit("ready", user);
      socket.on("notification", (notification: Notification) => {
        setNotifications((list) => [notification, ...list]);
      });
    }
  });

  const authenticate = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const resp = await fetch("http://localhost:3001/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });
      const { id } = await resp.json();
      toast("Logged in");
      setUser({ username, id });
    } catch (err) {}
    setLoading(false);
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        {user ? (
          <div>
            <h3>User: </h3>
            <h5>{user.username}</h5>
          </div>
        ) : (
          <div className="flex flex-col space-y-2">
            <input
              className="text-gray-800"
              placeholder="username"
              value={username}
              onChange={({ target: { value } }) => setUsername(value)}
            />
            <input
              className="text-gray-800"
              placeholder="password"
              value={password}
              onChange={({ target: { value } }) => setPassword(value)}
              type="password"
            />
            <button onClick={authenticate}>
              {loading ? "Loading" : "Submit"}
            </button>
          </div>
        )}
      </header>
      <div>
        <h1>Activity</h1>
        {notifications.map((notification) => (
          <div>{notification.message}</div>
        ))}
      </div>
      <ToastContainer />
    </div>
  );
};

export default App;

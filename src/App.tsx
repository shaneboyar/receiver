import React from "react";
import { io } from "socket.io-client";
import logo from "./logo.svg";
import "./App.css";

const socket = io("http://localhost:3000");

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <button
          onClick={() => {
            socket.emit("event", { a: "b", c: [] });
          }}
        >
          Press
        </button>
      </header>
    </div>
  );
}

export default App;

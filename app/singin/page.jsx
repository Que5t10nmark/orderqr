"use client";

import { useState } from "react";

export default function SignInPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  return (
    <div className="singin-container">
      <div className="singin-box">
        <h1 className="text-2xl font-bold">Sign In</h1>

        <div>Username</div>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <div className="mt-4">Password</div>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="mt-4">Sing In</button>
      </div>
    </div>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // ✅ error state
  const navigate = useNavigate();

  const handleLogin = () => {
    if (username === "test" && password === "test123") {
      localStorage.setItem("token", "fake-jwt-token");
      setError(""); // clear error
      navigate("/dashboard");
    } else {
      setError("Invalid username or password"); // ✅ show UI error
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">

      {/* CARD */}
      <div className="bg-white shadow-md rounded-lg w-full max-w-sm p-8">

        {/* TITLE */}
        <h2 className="text-xl font-semibold text-center mb-6">
          Task Manager
        </h2>

        {/* ERROR MESSAGE */}
        {error && (
          <p className="text-red-500 text-sm mb-3 text-center">
            {error}
          </p>
        )}

        {/* USERNAME */}
        <input
          placeholder="Username"
          className="border p-3 w-full mb-4 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        {/* PASSWORD */}
        <input
          placeholder="Password"
          type="password"
          className="border p-3 w-full mb-5 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* BUTTON */}
        <button
          onClick={handleLogin}
          className="bg-blue-600 hover:bg-blue-700 text-white w-full py-3 rounded text-sm"
        >
          Login
        </button>

        {/* INFO */}
        <p className="text-xs text-center text-gray-400 mt-5">
          test / test123
        </p>

      </div>
    </div>
  );
}

export default Login;
"use client"
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLogin() { // Rename to AdminLogin
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const router = useRouter();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();

        if (email === "maryamkhanhom@gmail.com" && password === "mimi") {
            localStorage.setItem("isLoggedIn", "true");
            router.push("/admin/dashboard");
        } else {
            alert("Invalid email or password");
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md">
                <h2 className="text-xl font-bold mb-4">Admin Login</h2>
                <input
                    type="email"
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 mb-4 border text-black border-gray-300 rounded"
                    value={email}
                />
                <input
                    type="password"
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 mb-4 border text-black border-gray-300 rounded"
                    value={password}
                />
                <button
                    type="submit"
                    className="w-full p-3 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Login
                </button>
            </form>
        </div>
    );
}

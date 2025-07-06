"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateContentPage() {
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleCreate = async () => {
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:5000/api/v1/contents", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ title, body }),
        });

        if (res.ok) {
            router.push("/contents");
        } else {
            const data = await res.json();
            setError(data.message || "Failed to create content");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6 flex justify-center items-center">
            <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-2xl">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Create New Content</h1>

                <div className="space-y-4">
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">Title</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">Body</label>
                        <textarea
                            className="w-full h-40 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-gray-700"
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                        />
                    </div>

                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                    <div className="flex justify-end">
                        <button
                            onClick={handleCreate}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

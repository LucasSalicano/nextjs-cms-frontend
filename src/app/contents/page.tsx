"use client";
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";

type Content = {
    id: string;
    title: string;
    version: number;
    createdAt: string;
};

export default function ContentsPage() {
    const [contents, setContents] = useState<Content[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const fetchContents = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            router.push("/login");
            return;
        }

        const res = await fetch("http://localhost:5000/api/v1/contents", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (res.ok) {
            const data = await res.json();
            setContents(data);
        }

        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        const token = localStorage.getItem("token");
        const confirmed = confirm("Are you sure you want to delete this content?");
        if (!confirmed) return;

        const res = await fetch(`http://localhost:5000/api/v1/contents/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (res.ok) {
            setContents(contents.filter((c) => c.id !== id));
        }
    };

    useEffect(() => {
        fetchContents();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-md">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Contents</h1>
                    <button
                        onClick={() => router.push("/contents/create")}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        + New Content
                    </button>
                </div>

                {loading ? (
                    <p className="text-gray-500">Loading...</p>
                ) : contents.length === 0 ? (
                    <p className="text-gray-500">No contents found.</p>
                ) : (
                    <ul className="space-y-4">
                        {contents.map((content) => (
                            <li
                                key={content.id}
                                className="border p-4 rounded-lg flex justify-between items-center"
                            >
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-500">{content.title}</h2>
                                    <p className="text-sm text-gray-500">
                                        Versions {content.version} •{" "}
                                        {new Date(content.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="space-x-2">
                                    <button
                                        onClick={() => router.push(`/contents/${content.id}`)}
                                        className="text-blue-600 hover:underline"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => router.push(`/contents/${content.id}/versions`)}
                                        className="text-indigo-600 hover:underline"
                                    >
                                        Versions
                                    </button>
                                    <button
                                        onClick={() => handleDelete(content.id)}
                                        className="text-red-600 hover:underline"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

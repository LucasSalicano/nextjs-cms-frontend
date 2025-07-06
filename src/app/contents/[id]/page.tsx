"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useContentSocket } from "@/hooks/useContentSocket";

export default function EditCollaborativePage() {
    const params = useParams();
    const router = useRouter();
    const contentId = params?.id as string;

    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [loading, setLoading] = useState(true);

    const { sendChange } = useContentSocket(contentId, (data) => {
        if (data.title !== undefined) setTitle(data.title);
        if (data.body !== undefined) setBody(data.body);
    });

    useEffect(() => {
        const fetchContent = async () => {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:5000/api/v1/contents/${contentId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            setTitle(data.title);
            setBody(data.body);
            setLoading(false);
        };

        if (contentId) fetchContent();
    }, [contentId]);

    const handleTitleChange = (value: string) => {
        setTitle(value);
        sendChange({ title: value, userId: localStorage.getItem("userId") });
    };

    const handleBodyChange = (value: string) => {
        setBody(value);
        sendChange({ body: value, userId: localStorage.getItem("userId") });
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6 flex justify-center items-center">
            <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Collaborative Edit</h1>
                    <button
                        onClick={() => router.push(`/contents`)}
                        className="text-sm text-blue-600 hover:underline"
                    >
                        ← Back
                    </button>
                </div>

                {loading ? (
                    <p className="text-gray-500">Loading...</p>
                ) : (
                    <div className="space-y-4">
                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700">Title</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500"
                                value={title}
                                onChange={(e) => handleTitleChange(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700">Body</label>
                            <textarea
                                className="w-full h-40 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-gray-500"
                                value={body}
                                onChange={(e) => handleBodyChange(e.target.value)}
                            />
                        </div>

                        <p className="text-xs text-gray-400 text-right">Changes are saved in real time</p>
                    </div>
                )}
            </div>
        </div>
    );
}

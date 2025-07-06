"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Version = {
    id: string;
    title: string;
    body: string;
    createdAt: string;
};

export default function ContentVersionsPage() {
    const [versions, setVersions] = useState<Version[]>([]);
    const [error, setError] = useState('');
    const router = useRouter();
    const params = useParams();
    const contentId = params?.id as string;

    useEffect(() => {
        const fetchVersions = async () => {
            const token = localStorage.getItem("token");

            const res = await fetch(`http://localhost:5000/api/v1/contents/${contentId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (res.ok) {
                const data = await res.json();
                setVersions(data.versions);
            } else {
                setError("Failed to fetch versions.");
            }
        };

        fetchVersions();
    }, [contentId]);

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-md">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-xl font-bold text-gray-800">Content Versions</h1>
                    <button
                        onClick={() => router.back()}
                        className="text-sm text-blue-600 hover:underline"
                    >
                        ← Back
                    </button>
                </div>

                {error && <p className="text-red-500 mb-4">{error}</p>}

                {versions.length === 0 ? (
                    <p className="text-gray-500">No versions found.</p>
                ) : (
                    <ul className="space-y-4">
                        {versions.map((version) => (
                            <li
                                key={version.id}
                                className="border p-4 rounded-lg bg-gray-50"
                            >
                                <h2 className="font-semibold text-gray-800">{version.title}</h2>
                                <p className="text-sm text-gray-600">
                                    {new Date(version.createdAt).toLocaleString()}
                                </p>
                                <p className="mt-2 text-sm text-gray-700">{version.body}</p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

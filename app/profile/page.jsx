"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Profile from "@components/Profile";
const UserProfile = () => {
  const { data: session, status } = useSession();

  const router = useRouter();
  const [userPosts, setUserPosts] = useState([]);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) router.push("/");

    const fetchData = async () => {
      const res = await fetch(`/api/users/${session?.user.id}/posts`);
      const data = await res.json();

      setUserPosts(data);
    };

    if (session?.user.id) fetchData();
  }, [session?.user.id, session, status]);

  const handleEdit = (post) => {
    router.push(`/update-prompt?id=${post._id}`);
  };

  const handleDelete = async (post) => {
    const hasConfirmed = confirm(
      "Are you sure you want to delete this prompt?"
    );
    if (hasConfirmed) {
      try {
        const res = await fetch(`/api/prompt/${post._id.toString()}`, {
          method: "DELETE",
        });

        if (res.ok) {
          setUserPosts((prev) => prev.filter((p) => p._id !== post._id));
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  return status === "loading" ? (
    <div>Loading...</div>
  ) : userPosts.length !== 0 ? (
    <Profile
      name="My"
      desc="Welcome to your custom profile page. Showcase your unique prompts and inspire others with your creativity."
      data={userPosts}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
    />
  ) : (
    <div className=" p-4 rounded mt-20 glassmorphism">
      <p className="text-gray-700 text-lg">
        No posts yet.{" "}
        <a href="/create-prompt" className="text-blue-500 hover:underline">
          Create your very first prompt
        </a>
      </p>
    </div>
  );
};

export default UserProfile;

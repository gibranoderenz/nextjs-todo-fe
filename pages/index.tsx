import Head from "next/head";
import Image from "next/image";
import { initFirebase } from "../utils/firebase";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import { FcGoogle } from "react-icons/fc";
import Lottie from "lottie-react";
import Hero from "../assets/home-hero.json";

export default function Home() {
  initFirebase();
  const provider = new GoogleAuthProvider();
  const auth = getAuth();
  const [user, loading] = useAuthState(auth);

  const router = useRouter();

  if (loading) {
    return <div>Loading</div>;
  }

  if (user) {
    router.push(`/todos/${user.uid}`);
  }

  const logIn = async () => {
    const result = await signInWithPopup(auth, provider);
  };

  return (
    <>
      {/* Navbar */}
      <nav className=" px-6 py-2 flex items-center justify-between">
        <strong>Td</strong>
        <button
          onClick={logIn}
          className="px-4 py-2 bg-black text-white rounded-lg shadow-md"
        >
          Login
        </button>
      </nav>
      {/* Content */}
      <section className="flex flex-col items-center justify-center mt-4">
        {/* Header */}
        <h1 className="font-bold text-3xl">All your todos, in one place.</h1>

        {/* Animation */}
        <Lottie animationData={Hero} loop={true} className="w-1/3 h-1/3" />

        {/* Login */}
        <div>
          <button
            className="text-lg flex gap-3 items-center border border-gray-100 bg-gray-50 shadow-sm px-4 py-3 rounded-md"
            onClick={logIn}
          >
            <FcGoogle />
            Login with Google
          </button>
        </div>
      </section>
    </>
  );
}

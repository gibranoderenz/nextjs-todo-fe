import Head from "next/head";
import Image from "next/image";
import { initFirebase } from "../utils/firebase";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";

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
    router.push("/todos");
  }

  const logIn = async () => {
    const result = await signInWithPopup(auth, provider);
  };

  return (
    <div>
      <h1 className="font-bold text-3xl">Login</h1>;
      <button
        onClick={logIn}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg"
      >
        Login
      </button>
    </div>
  );
}

import { initFirebase } from "../../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";
import { useRouter } from "next/router";
import { useEffect } from "react";

const Todos = () => {
  initFirebase();
  const auth = getAuth();
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/");
    }
  }, [user]);

  const logOut = async () => {
    auth.signOut();
  };

  return (
    <div>
      <h1>Todos {user?.displayName}</h1>
      <button onClick={logOut}>Logout</button>
    </div>
  );
};

export default Todos;

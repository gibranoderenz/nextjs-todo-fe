import { initFirebase } from "../../../utils/firebase";
import Head from "next/head";
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

const Todos = () => {
  initFirebase();
  const auth = getAuth();
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  const [todos, setTodos] = useState([]);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>();

  interface Todo {
    id: number;
    user: string;
    title: string;
    description: string;
    createdAt: string;
    isFinished: boolean;
  }

  useEffect(() => {
    if (!user) {
      router.push("/");
    }
    getTodos();
  }, [user]);

  const logOut = async () => {
    auth.signOut();
  };

  const getTodos = () => {
    fetch(`http://localhost:3000/todos/${user?.uid}`)
      .then((res) => res.json())
      .then((data) => setTodos(data))
      .catch((err) => alert(err));
  };

  const toggleTodo = ({ id, isFinished }: Todo) => {
    fetch(`http://localhost:3000/todos/${user?.uid!}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        isFinished: isFinished ? false : true,
      }),
    })
      .then((res) => res.json())
      .then((todos) => setTodos(todos))
      .catch((err) => alert(err));
  };

  const deleteTodo = ({ id }: Todo) => {
    fetch(`http://localhost:3000/todos/${user?.uid!}/${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        return res.json();
      })
      .then((todos) => setTodos(todos))
      .catch((err) => alert(err));
  };

  const createTodo = (formData: FormData) => {
    formData.append("user", user?.uid!);
    fetch(`http://localhost:3000/todos/${user?.uid!}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(Object.fromEntries(formData.entries())),
    })
      .then((res) => res.json())
      .then((todos) => {
        setTodos(todos);
      })
      .catch((err) => alert(err));
  };

  const editTodo = (formData: FormData) => {
    fetch(`http://localhost:3000/todos/${user?.uid!}/${selectedTodo?.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(Object.fromEntries(formData.entries())),
    })
      .then((res) => res.json())
      .then((todos) => {
        setTodos(todos);
      })
      .catch((err) => alert(err));
  };

  return (
    <div>
      <Head>
        <title>{user ? user.displayName + "'s Todos" : "Welcome"}</title>
      </Head>
      <h1 className="text-2xl font-bold">
        {user ? user.displayName + "'s Todos" : "Welcome"}
      </h1>
      <button
        onClick={logOut}
        className="px-4 py-2 bg-red-600 text-white rounded-lg"
      >
        Logout
      </button>

      {/* Todos */}
      <section className="flex flex-col items-center justify-center">
        {todos.length > 0 &&
          todos.map((todo: Todo) => (
            <div
              key={todo.id}
              className="border border-gray-300 bg-slate-50 mb-6 p-6 rounded-lg w-1/2 flex items-center justify-between"
            >
              {/* Info */}
              <div>
                <div>
                  <strong className="text-xl">{todo.title}</strong>
                </div>
                <div>
                  <p>{todo.description}</p>
                  <p>{new Date(todo.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Buttons */}
              <div className="grid gap-2">
                {todo.isFinished ? (
                  <button
                    className="px-4 py-2 bg-black text-white rounded-lg"
                    onClick={() => toggleTodo(todo)}
                  >
                    Undo!
                  </button>
                ) : (
                  <button
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                    onClick={() => toggleTodo(todo)}
                  >
                    Done!
                  </button>
                )}

                <label
                  htmlFor="edit-modal"
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg"
                  onClick={() => {
                    setSelectedTodo(todo);
                  }}
                >
                  Edit
                </label>
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded-lg"
                  onClick={() => deleteTodo(todo)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
      </section>

      <section>
        {/* The button to open add modal */}
        <label
          htmlFor="add-modal"
          className="px-4 py-2 rounded-lg bg-orange-500 text-white"
        >
          Add Todo
        </label>
      </section>

      {/* Add Modal */}
      <input type="checkbox" id="add-modal" className="modal-toggle" />
      <label htmlFor="add-modal" className="modal cursor-pointer">
        <label className="modal-box relative" htmlFor="">
          <p className="text-xl font-bold mb-4">Add Todo</p>
          <form
            id="add-form"
            action=""
            className="flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              const data = new FormData(e.target as HTMLFormElement);
              createTodo(data);

              // Reset form
              const form = document.getElementById(
                "add-form"
              )! as HTMLFormElement;
              form.reset();

              // Close the modal
              const modal = document.getElementById(
                "add-modal"
              )! as HTMLFormElement;
              modal.checked = false;
            }}
          >
            <div className="grid">
              <label htmlFor="title">Title</label>
              <input
                className="bg-gray-50 border border-gray-300 rounded-lg p-2.5"
                type="text"
                name="title"
                id="title"
              />
            </div>

            <div className="grid">
              <label htmlFor="description">Description</label>
              <textarea
                className="bg-gray-50 border border-gray-300 rounded-lg p-2.5"
                name="description"
                id="description"
              />
            </div>

            <input
              className="px-4 py-2 bg-blue-500 text-white rounded-lg"
              type="submit"
              value="Submit"
            />
          </form>
        </label>
      </label>

      {/* Edit Modal */}
      <input type="checkbox" id="edit-modal" className="modal-toggle" />
      <label htmlFor="edit-modal" className="modal cursor-pointer">
        <label className="modal-box relative" htmlFor="">
          <p className="text-xl font-bold mb-4">Edit Todo</p>
          <form
            action=""
            className="flex flex-col gap-4"
            id="edit-form"
            onSubmit={(e) => {
              e.preventDefault();
              const data = new FormData(e.target as HTMLFormElement);
              editTodo(data);

              // Close the modal
              const modal = document.getElementById(
                "edit-modal"
              )! as HTMLFormElement;
              modal.checked = false;
            }}
          >
            <div className="grid">
              <label htmlFor="title">Title</label>
              <input
                className="bg-gray-50 border border-gray-300 rounded-lg p-2.5"
                type="text"
                name="title"
                id="title"
                defaultValue={selectedTodo?.title}
              />
            </div>

            <div className="grid">
              <label htmlFor="description">Description</label>
              <textarea
                className="bg-gray-50 border border-gray-300 rounded-lg p-2.5"
                name="description"
                id="description"
                defaultValue={selectedTodo?.description}
              />
            </div>

            <input
              className="px-4 py-2 bg-blue-500 text-white rounded-lg"
              type="submit"
              value="Submit"
            />
          </form>
        </label>
      </label>
    </div>
  );
};

export default Todos;

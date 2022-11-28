import { initFirebase } from "../../../utils/firebase";
import Head from "next/head";
import Image from "next/image";
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import {
  AiOutlineCheckCircle,
  AiOutlineDelete,
  AiOutlineEdit,
  AiOutlineUndo,
} from "react-icons/ai";

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
    <>
      <Head>
        <title>Td | {user ? user.displayName + "'s Todos" : "Welcome"}</title>
      </Head>
      {/* Navbar */}
      <div className="navbar bg-base-100">
        <div className="flex-1">
          <a className="btn btn-ghost normal-case text-xl">Td</a>
        </div>
        <div className="flex-none">
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <Image
                src={user?.photoURL!}
                alt="User Photo"
                width={32}
                height={32}
                className="rounded-full"
              />
            </label>
            <ul
              tabIndex={0}
              className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-md w-48"
            >
              <li className="gap-2">
                <a>Welcome, {user?.displayName}</a>
                <button
                  className="bg-red-600 border-none text-white px-4 py-2"
                  onClick={logOut}
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Content */}
      <section className="mt-4 flex flex-col items-center justify-center px-8 md:px-0">
        {/* Header */}
        <div className="flex items-center justify-between w-full md:w-1/2 mb-6">
          <h1 className="text-3xl font-bold">
            {user ? user.displayName?.split(" ")[0] + "'s Todos" : "Welcome"}
          </h1>
          {/* The button to open add modal */}

          <label
            htmlFor="add-modal"
            className="px-4 py-2 rounded-lg bg-black shadow-md text-white hover:cursor-pointer hover:scale-105 duration-75"
          >
            Add Todo
          </label>
        </div>

        {/* Todos */}
        <div className="flex flex-col items-center justify-center w-full">
          {todos.length > 0 &&
            todos.map((todo: Todo) => (
              <label
                htmlFor="edit-modal"
                onClick={() => {
                  setSelectedTodo(todo);
                }}
                key={todo.id}
                className="border border-gray-300 bg-slate-50 mb-6 p-6 rounded-lg w-full md:w-1/2 flex items-center justify-between hover:scale-105 duration-75"
              >
                <div className="flex items-center gap-6">
                  {/* Edit and Delete Button */}
                  <div className="flex flex-col gap-4 items-center justify-center">
                    <label
                      htmlFor="edit-modal"
                      className="hover:cursor-pointer"
                      onClick={() => {
                        setSelectedTodo(todo);
                      }}
                    >
                      <AiOutlineEdit size={26} />
                    </label>
                    <button onClick={() => deleteTodo(todo)}>
                      <AiOutlineDelete size={24} />
                    </button>
                  </div>
                  {/* Info */}
                  <div>
                    <div>
                      <strong className="text-xl">{todo.title}</strong>
                    </div>
                    <div>
                      <p>{todo.description}</p>
                      <p className="mt-4 badge">
                        Created{" "}
                        {new Date(todo.createdAt).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex flex-col gap-2 items-center justify-center">
                  {todo.isFinished ? (
                    <button onClick={() => toggleTodo(todo)}>
                      <AiOutlineUndo size={28} />
                    </button>
                  ) : (
                    <button onClick={() => toggleTodo(todo)}>
                      <AiOutlineCheckCircle size={28} />
                    </button>
                  )}
                </div>
              </label>
            ))}
        </div>
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
              className="px-4 py-2 bg-black text-white rounded-lg"
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
              className="px-4 py-2 bg-black text-white rounded-lg"
              type="submit"
              value="Edit"
            />
          </form>
        </label>
      </label>
    </>
  );
};

export default Todos;

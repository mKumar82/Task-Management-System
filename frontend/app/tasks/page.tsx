"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { logout } from "@/lib/auth";

type Task = {
  id: string;
  title: string;
  description?: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);

  const loadTasks = async () => {
    try {
      const query = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (search) query.append("search", search);
      if (status !== "ALL") query.append("status", status);

      const data = await apiFetch(`/api/tasks?${query.toString()}`);
      setTasks(data.tasks);
    } catch (err: any) {
      if (err.status === 401) {
        localStorage.clear();
        router.replace("/login");
      }
    }
  };

  const createTask = async () => {
    try {
      await apiFetch("/api/tasks", {
        method: "POST",
        body: JSON.stringify({ title, description }),
      });

      setTitle("");
      setDescription("");
      toast.success("Task added");
      loadTasks();
    } catch {
      toast.error("Failed to add task");
    }
  };
  const updateTask = async (taskId: string) => {
    try {
      await apiFetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        body: JSON.stringify({
          title,
          description,
        }),
      });

      setTitle("");
      setDescription("");
      setEditingTaskId(null);
      toast.success("Task updated");
      loadTasks();
    } catch (err) {
      toast.error("Failed to update task");
    }
  };

  const toggleTask = async (id: string) => {
    try {
      await apiFetch(`/api/tasks/${id}/toggle`, { method: "POST" });
      toast.success("Task status updated");
      loadTasks();
    } catch (err: any) {
      toast.error("Failed to update task");
      if (err.status === 401) {
        localStorage.clear();
        router.replace("/login");
      }
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await apiFetch(`/api/tasks/${id}`, { method: "DELETE" });
      toast.success("Task deleted");
      loadTasks();
    } catch (err: any) {
      toast.error("Failed to delete task");
      if (err.status === 401) {
        localStorage.clear();
        router.replace("/login");
      }
    }
  };

  useEffect(() => {
    loadTasks();
  }, [search, status, page,limit]);

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex justify-center">
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-md p-6">
        {/* Header */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => {
              logout();
              toast.success("logged out");
            }}
            className="text-sm bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
          >
            Logout
          </button>
        </div>

        <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          My Tasks
        </h1>

        {/* Add Task */}
        <div className="flex flex-col md:flex-row mb-6 gap-5">
          <input
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            className="flex-2 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter a new task..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button
            onClick={() =>
              editingTaskId ? updateTask(editingTaskId) : createTask()
            }
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            {editingTaskId ? "Update" : "Add"}
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-3 mb-6">
          {/* Search */}
          <input
            type="text"
            placeholder="Search by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Filter */}
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 bg-white"
          >
            <option value="ALL">All</option>
            <option value="TODO">Todo</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
          </select>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <span>Tasks per page:</span>
          <select
            value={limit}
            onChange={(e) => {
              setPage(1); // reset to page 1
              setLimit(Number(e.target.value));
            //   loadTasks();
            }}
            className="border rounded px-2 py-1"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>

        {/* Task List */}
        {tasks && tasks.length === 0 ? (
          <p className="text-center text-gray-500">No tasks yet</p>
        ) : (
          <ul className="space-y-3">
            {tasks?.map((task) => (
              <li
                key={task.id}
                className="flex items-center justify-between bg-gray-50 border rounded-lg p-4"
              >
                {/* Title & Status */}
                <div>
                  <p
                    className={`font-medium ${
                      task.status === "DONE"
                        ? "line-through text-gray-400"
                        : "text-gray-800"
                    }`}
                  >
                    {task.title}
                  </p>
                  <p
                    className={`font-medium ${
                      task.status === "DONE"
                        ? "line-through text-gray-400"
                        : "text-gray-800"
                    }`}
                  >
                    {task.description}
                  </p>
                  <span
                    className={`inline-block mt-1 text-xs px-2 py-1 rounded-full ${
                      task.status === "DONE"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {task.status}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex flex-col md:flex-row  gap-1 md:gap-5">
                  <button
                    className="text-sm px-3 py-1 rounded-lg border hover:bg-gray-100 transition"
                    onClick={() => {
                      setEditingTaskId(task.id);
                      setTitle(task.title);
                      setDescription(task.description || "");
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => toggleTask(task.id)}
                    className="text-sm px-3 py-1 rounded-lg border hover:bg-gray-100 transition"
                  >
                    Toggle
                  </button>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="text-sm px-3 py-1 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* pagination ui */}
        <div className="flex justify-between items-center mt-6 bg-white p-4 rounded-xl shadow-md">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-100 transition"
          >
            Prev
          </button>

          <span className="text-sm text-gray-600">Page {page}</span>

          <button
            disabled={tasks?.length < limit}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 border rounded-lg hover:bg-gray-100 transition"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

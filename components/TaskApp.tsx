
"use client";

import { useEffect, useMemo, useState } from "react";

type Task = {
  id: string;
  title: string;
  notes?: string;
  done: boolean;
  createdAt: number;
  dueDate?: string;
  priority: "low" | "medium" | "high";
};

type User = { email: string };

const uid = () => Math.random().toString(36).slice(2, 10);

function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) setValue(JSON.parse(raw));
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  }, [key, value]);
  return [value, setValue] as const;
}

type Filter = "all" | "active" | "completed";

export default function TaskApp() {
  const [user, setUser] = useLocalStorage<User | null>("tm_user", null);
  const [tasks, setTasks] = useLocalStorage<Task[]>("tm_tasks", []);
  const [theme, setTheme] = useLocalStorage<"light" | "dark">("tm_theme", "light");

  // Theme toggle
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
  }, [theme]);

  // Form state
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [priority, setPriority] = useState<Task["priority"]>("medium");
  const [dueDate, setDueDate] = useState<string>("");

  // Filter
  const [filter, setFilter] = useState<Filter>("all");
  const filteredTasks = useMemo(() => {
    if (filter === "active") return tasks.filter(t => !t.done);
    if (filter === "completed") return tasks.filter(t => t.done);
    return tasks;
  }, [tasks, filter]);

  const remaining = useMemo(() => tasks.filter(t => !t.done).length, [tasks]);

  function addTask() {
    if (!title.trim()) return;
    const t: Task = {
      id: uid(),
      title: title.trim(),
      notes: notes.trim() || undefined,
      done: false,
      createdAt: Date.now(),
      dueDate: dueDate || undefined,
      priority
    };
    setTasks([t, ...tasks]);
    setTitle("");
    setNotes("");
    setDueDate("");
    setPriority("medium");
  }

  function toggleDone(id: string) {
    setTasks(tasks.map(t => (t.id === id ? { ...t, done: !t.done } : t)));
  }

  function removeTask(id: string) {
    setTasks(tasks.filter(t => t.id !== id));
  }

  function clearDone() {
    setTasks(tasks.filter(t => !t.done));
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-md rounded-2xl shadow-soft p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Task Manager</h1>
            <span className="text-2xl">🗂️</span>
          </div>
          <p className="text-sm text-gray-500 mb-6">
            Logga in med din e-post (mockad – ingen server, sparas endast lokalt).
          </p>
          <EmailLogin onLogin={(email) => setUser({ email })} />
          <p className="text-xs text-gray-500 mt-6">
            Tips: Efter inloggning kan du växla mörkt/ljust tema och uppgifterna sparas lokalt.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-6">
      <header className="container mb-6">
        <div className="rounded-2xl border bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 p-4 shadow-soft flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Task Manager</h1>
            <p className="text-sm text-gray-500">
              Inloggad som <span className="font-medium">{user.email}</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="px-3 py-2 rounded-xl border text-sm bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
            >
              {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
            </button>
            <button
              onClick={() => setUser(null)}
              className="px-3 py-2 rounded-xl border text-sm bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
            >
              Logga ut
            </button>
          </div>
        </div>
      </header>

      <main className="container space-y-6">
        {/* New Task */}
        <section className="rounded-2xl border bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 p-4 shadow-soft">
          <h2 className="font-semibold mb-3">Ny uppgift</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            <input
              className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Titel (t.ex. 'Bygga UI för listan')"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <select
              className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
              value={priority}
              onChange={(e) => setPriority(e.target.value as Task["priority"])}
            >
              <option value="low">Prioritet: Låg</option>
              <option value="medium">Prioritet: Medel</option>
              <option value="high">Prioritet: Hög</option>
            </select>
            <input
              type="date"
              className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
            <input
              className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Anteckningar (valfritt)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={addTask}
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition shadow"
            >
              Lägg till
            </button>
            <button
              onClick={clearDone}
              className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
            >
              Rensa klara
            </button>
          </div>
        </section>

        {/* Filters + Stats */}
        <section className="rounded-2xl border bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 p-4 shadow-soft">
          <div className="flex items-center justify-between">
            <div className="inline-flex rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
              <FilterButton label="Alla" active={filter === "all"} onClick={() => setFilter("all")} />
              <FilterButton label="Aktiva" active={filter === "active"} onClick={() => setFilter("active")} />
              <FilterButton label="Klara" active={filter === "completed"} onClick={() => setFilter("completed")} />
            </div>
            <span className="text-sm text-gray-500">{remaining} kvar</span>
          </div>
        </section>

        {/* Task list */}
        <section className="rounded-2xl border bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 p-4 shadow-soft">
          <ul className="space-y-2">
            {filteredTasks.length === 0 && (
              <li className="text-sm text-gray-500">Inget att visa här. Lägg till en uppgift ovan.</li>
            )}
            {filteredTasks.map((task) => (
              <li
                key={task.id}
                className="rounded-xl border border-gray-200 dark:border-gray-800 p-3 flex items-start justify-between bg-white dark:bg-gray-950"
              >
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={task.done}
                    onChange={() => toggleDone(task.id)}
                    className="mt-1 size-5"
                  />
                  <div>
                    <div className="font-medium">
                      {task.title}
                    </div>
                    <div className="text-xs text-gray-500 flex gap-2 mt-1">
                      <span className="px-2 py-0.5 rounded-full border border-gray-200 dark:border-gray-800">
                        {task.priority}
                      </span>
                      {task.dueDate && <span>Due: {task.dueDate}</span>}
                    </div>
                    {task.notes && (
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{task.notes}</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => removeTask(task.id)}
                  className="text-sm text-red-600 hover:underline"
                >
                  Ta bort
                </button>
              </li>
            ))}
          </ul>
        </section>

        <footer className="text-center text-xs text-gray-500">
          Byggd med Next.js & Tailwind. All data lagras lokalt.
        </footer>
      </main>
    </div>
  );
}

function EmailLogin({ onLogin }: { onLogin: (email: string) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!email.includes("@")) return;
        onLogin(email);
      }}
      className="space-y-3"
    >
      <input
        className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
        placeholder="din@email.se"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="email"
      />
      <input
        className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
        placeholder="lösenord (valfritt)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
      />
      <button
        type="submit"
        className="w-full px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition shadow"
      >
        Logga in
      </button>
      <p className="text-xs text-gray-500">
        Detta är bara en mockad inloggning – inga konton skapas, allt sparas lokalt.
      </p>
    </form>
  );
}

function FilterButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={[
        "px-3 py-2 text-sm",
      active ? "bg-gray-100 dark:bg-gray-800" : "bg-white dark:bg-gray-900",
      ].join(" ")}
    >
      {label}
    </button>
  );
}

"use client";

import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

export default function Table({ notes, setIsNew, page, setPage }) {
  function handleReplay(id) {
    axios
      .post(
        `${process.env.NEXT_PUBLIC_BASE}/api/notes/${id}/replay`,
        {},
        {
          headers: {
            Authorization: "Bearer " + process.env.NEXT_PUBLIC_TOKEN,
          },
        }
      )
      .then((res) => {
        if (res.status === 201) {
          setIsNew(true);
        }
      })
      .catch((err) => console.log("Error replaying ", err));
  }

  return (
    <div className="m-5 col-span-2">
      <div className="overflow-x-auto rounded-xl shadow-md">
        <table className="w-full border-collapse">
          <thead className="bg-white py-3">
            <tr className="bg-gray-100 text-left text-sm uppercase text-gray-600">
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Last Attempt Code</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {notes.length > 0 &&
              notes.map((note) => (
                <AnimatePresence key={note._id}>
                  <motion.tr
                    key={note._id}
                    initial={{ scale: 1 }}
                    animate={
                      note.status === "Delivered"
                        ? { scale: [1, 1.05, 1] }
                        : { scale: 1 }
                    }
                    transition={{ duration: 0.6 }}
                  >
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {note._id}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium">
                      {note.title}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          note.status === "Delivered"
                            ? "bg-green-100 text-green-700"
                            : note.status === "Dead"
                            ? "bg-red-100 text-red-700"
                            : note.status === "Pending"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {note.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {note.attempts.length > 0
                        ? note.attempts[note.attempts.length - 1].statusCode
                        : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                        onClick={() => handleReplay(note._id)}
                      >
                        Replay
                      </button>
                    </td>
                  </motion.tr>
                </AnimatePresence>
              ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-2 mt-4">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className={`px-3 py-1 text-sm rounded-md border ${
              page === 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white hover:bg-gray-50"
            }`}
          >
            Prev
          </button>
          <span className="text-sm font-medium">{page}</span>
          <button
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 text-sm rounded-md border bg-white hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

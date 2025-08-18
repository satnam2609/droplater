"use client";

import { useEffect, useState } from "react";

import Form from "@/components/Form";
import axios from "axios";
import dayjs from "dayjs";
import Table from "@/components/Table";
export default function Home() {
  const [isNew, setIsNew] = useState(false);

  function handleSubmitNote(data) {
    const { title, body, releaseAt, webhookUrl } = data;
    axios
      .post(process.env.NEXT_PUBLIC_BASE+"/api/notes", {
        title,
        body,
        releaseAt: dayjs(releaseAt).toISOString(),
        webhookUrl,
      },{
        headers:{
          Authorization:"Bearer " + process.env.NEXT_PUBLIC_TOKEN
        }
      })
      .then((res) => {
        if (res.status === 201) {
          setIsNew(true);
        }
      })
      .catch((err) => console.log("POST request failed with error: ", err));
  }

  const [notes, setNotes] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    (async () => {
      await fetchNotes(page);
    })();
  }, [isNew, page]);

  async function fetchNotes(pageNum) {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE}/api/notes?status=&page=${pageNum}`,
        {
          headers: {
            Authorization: "Bearer " + process.env.NEXT_PUBLIC_TOKEN,
          },
        }
      );
      if (res.status === 200) {
        setNotes(res.data.message);
        setIsNew(false);
      } else {
        throw new Error(res.data.message);
      }
    } catch (err) {
      console.error("Notes Fetching Error:", err);
    } finally {
    }
  }
  return (
    <div className="w-full">
      <div className="bg-black py-4 px-4">
        <p className="text-white text-xl font-semibold">Drop later</p>
      </div>
      <div className="grid grid-cols-3 w-full">
        {/* Form */}
        <Form handleSubmitNote={handleSubmitNote} />
        {/* Table */}
        <Table
          notes={notes}
          setIsNew={setIsNew}
          page={page}
          setPage={setPage}
        />
      </div>
    </div>
  );
}

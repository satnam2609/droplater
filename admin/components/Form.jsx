"use client";

import dayjs from "dayjs";
import { useForm } from "react-hook-form";

export default function Form({ handleSubmitNote }) {
  const {
    handleSubmit,
    register,
    formState: { isValid, errors },
  } = useForm({
    mode: "onChange",
  });
  return (
    <div className="w-full m-6">
      <form className="flex flex-col p-6 w-full gap-3 max-w-lg bg-gray-100 shadow-lg border border-gray-200 rounded-2xl" onSubmit={handleSubmit(handleSubmitNote)}>
        <span className="text-xl font-semibold">Add your Note</span>
        <div className="flex flex-col">
          <input
            {...register("title", {
              required: true,
              minLength: 1,
            })}
            type="text"
            placeholder="Enter title for your note"
            className="px-4 py-2 rounded-lg border border-gray-300 outline-none"
          />
          {errors?.title && (
            <span className="text-sm text-red-500">Title is required</span>
          )}
        </div>

        <div className="flex flex-col">
          <input
            {...register("body", {
              required: true,
              minLength: 1,
            })}
            type="text"
            placeholder="Enter body for your note"
            className="px-4 py-2 rounded-lg border border-gray-300 outline-none"
          />
          {errors?.body && (
            <span className="text-sm text-red-500">Body is required</span>
          )}
        </div>

        <div className="flex flex-col">
          <input
            {...register("releastAt", {
              required: true,
            })}
            type="datetime-local"
            className="px-4 py-2 rounded-lg border border-gray-300 outline-none"
          />
          {errors?.releaseAt && (
            <span className="text-sm text-red-500">
              Release Date is required
            </span>
          )}
        </div>

        <div className="flex flex-col">
          <input
            {...register("webhookUrl", {
              required: true,
              minLength: 1,
            })}
            type="url"
            placeholder="Enter webhookUrl"
            className="px-4 py-2 rounded-lg border border-gray-300 outline-none"
          />
          {errors?.webhookUrl && (
            <span className="text-sm text-red-500">WebhookUrl is required</span>
          )}
        </div>

        <button
          disabled={!isValid}
          className={`${
            isValid ? "bg-amber-300" : "bg-gray-500"
          } px-4 py-3 rounded-2xl`}
        >
          Submit
        </button>
      </form>
    </div>
  );
}

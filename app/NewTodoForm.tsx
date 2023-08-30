"use client";
import { FormEvent, startTransition, useReducer } from "react";
import styles from "./NewTodoForm.module.scss";
import apiClient from "@/src/apiClient";
import { useRouter } from "next/navigation";

const initialState = {
  content: "",
  dueDate: "",
};

function formDataReducer(
  state: typeof initialState,
  { set, value }: { set: string; value: string }
) {
  return {
    ...state,
    [set]: value,
  };
}

export default function NewTodoForm() {
  const router = useRouter();
  const [formData, dispatchFormData] = useReducer(
    formDataReducer,
    initialState
  );

  async function createTodo(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await apiClient.api.createTodo({
      content: formData.content,
      dueDate:
        formData.dueDate.length > 0
          ? new Date(formData.dueDate).toISOString()
          : undefined,
    });
    startTransition(() => {
      router.refresh();
    });

    return false;
  }

  return (
    <div className={styles.newTodoFormContainer}>
      <form className={styles.newTodoForm} onSubmit={createTodo}>
        <input
          placeholder="Stavka..."
          value={formData.content}
          onChange={(e) =>
            dispatchFormData({ set: "content", value: e.currentTarget.value })
          }
          className={styles.input}
          style={{ flex: 2 }}
        />
        <input
          placeholder="Obaviti do..."
          type="datetime-local"
          value={formData.dueDate}
          onChange={(e) =>
            dispatchFormData({
              set: "dueDate",
              value: e.currentTarget.value,
            })
          }
          className={styles.input}
          style={{ flex: 1 }}
        />
        <input
          type="submit"
          value="OK"
          className={styles.input}
          style={{ flex: 0, minWidth: "100px" }}
        />
      </form>
    </div>
  );
}

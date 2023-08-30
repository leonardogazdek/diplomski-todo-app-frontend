"use client";
import type { TodoResponseDto } from "@/api-client/Api";
import styles from "./TodosTable.module.scss";
import { startTransition, useReducer, useState } from "react";
import type { Dispatch } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import trashIco from "@/assets/icons/trash.png";
import editIco from "@/assets/icons/edit.png";
import tickIco from "@/assets/icons/tick.png";
import closeIco from "@/assets/icons/close.png";
import Image from "next/image";
import apiClient from "@/src/apiClient";
import { convertToDateTimeLocal } from "@/src/Util";

interface EditingState {
  id?: string;
  content?: string;
  dueDate?: string;
}

const initialEditingState: EditingState = {
  id: undefined,
  content: undefined,
  dueDate: undefined,
};

function editingDataReducer(
  state: EditingState,
  { set, value }: { set: string; value?: string | EditingState }
) {
  if (set === "batch") {
    return {
      ...(value as EditingState),
    };
  }
  if (set === "reset") {
    return {
      ...initialEditingState,
    };
  }
  return {
    ...state,
    [set]: value,
  };
}

export default function TodosTable({ todos }: { todos: TodoResponseDto[] }) {
  const [editingData, dispatchEditingData] = useReducer(
    editingDataReducer,
    initialEditingState
  );

  return (
    <table className={styles.todosTable}>
      <thead>
        <tr>
          <th>Stavka</th>
          <th>Kreirana</th>
          <th>Obaviti do</th>
          <th style={{ textAlign: "right" }}>Radnje</th>
        </tr>
      </thead>
      <tbody>
        {todos?.map((todo) => (
          <tr key={todo.id}>
            {editingData.id !== todo.id && (
              <ReadOnlyTableRow
                todo={todo}
                dispatchEditingData={dispatchEditingData}
              />
            )}
            {editingData.id === todo.id && (
              <EditingTableRow
                todo={todo}
                editingData={editingData}
                dispatchEditingData={dispatchEditingData}
              />
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function ReadOnlyTableRow({
  todo,
  dispatchEditingData,
}: {
  todo: TodoResponseDto;
  dispatchEditingData: Dispatch<{
    set: string;
    value: string | EditingState | undefined;
  }>;
}) {
  const router = useRouter();
  function editTodo(todo: TodoResponseDto) {
    dispatchEditingData({
      set: "batch",
      value: {
        id: todo.id,
        content: todo.content,
        dueDate: convertToDateTimeLocal(
          todo.dueDate ? new Date(todo.dueDate) : undefined
        ),
      },
    });
  }
  async function deleteTodo(id: string) {
    await apiClient.api.deleteTodo(id);
    startTransition(() => {
      router.refresh();
    });
  }
  return (
    <>
      <td>{todo.content}</td>
      <td>{new Date(todo.createdAt).toLocaleString("hr-HR")}</td>
      <td>
        {todo.dueDate ? new Date(todo.dueDate).toLocaleString("hr-HR") : "-"}
      </td>
      <td style={{ textAlign: "right" }}>
        <Image
          src={trashIco}
          className={styles.icon}
          alt="Obriši"
          width={25}
          height={25}
          onClick={() => {
            deleteTodo(todo.id);
          }}
        />
        <Image
          src={editIco}
          className={styles.icon}
          alt="Uredi"
          width={25}
          height={25}
          onClick={() => {
            editTodo(todo);
          }}
        />
      </td>
    </>
  );
}

function EditingTableRow({
  todo,
  editingData,
  dispatchEditingData,
}: {
  todo: TodoResponseDto;
  editingData: EditingState;
  dispatchEditingData: Dispatch<{
    set: string;
    value: string | EditingState | undefined;
  }>;
}) {
  const router = useRouter();
  async function updateTodo() {
    await apiClient.api.updateTodo(editingData.id!, {
      content: editingData.content!,
      dueDate:
        editingData.dueDate && editingData.dueDate.length > 0
          ? new Date(editingData.dueDate).toISOString()
          : (null as unknown as undefined),
    });
    dispatchEditingData({ set: "reset", value: undefined });
    startTransition(() => {
      router.refresh();
    });
  }
  return (
    <>
      <td>
        <input
          className={styles.editInput}
          value={editingData.content}
          onChange={(e) =>
            dispatchEditingData({
              set: "content",
              value: e.currentTarget.value,
            })
          }
        />
      </td>
      <td>{new Date(todo.createdAt).toLocaleString("hr-HR")}</td>
      <td>
        <input
          className={styles.editInput}
          value={editingData.dueDate}
          type="datetime-local"
          onChange={(e) =>
            dispatchEditingData({
              set: "dueDate",
              value: e.currentTarget.value,
            })
          }
        />
      </td>
      <td style={{ textAlign: "right" }}>
        <Image
          src={tickIco}
          className={styles.icon}
          alt="OK"
          width={25}
          height={25}
          onClick={updateTodo}
        />
        <Image
          src={closeIco}
          className={styles.icon}
          alt="OK"
          width={25}
          height={25}
          onClick={() => {
            dispatchEditingData({ set: "reset", value: undefined });
          }}
        />
      </td>
    </>
  );
}

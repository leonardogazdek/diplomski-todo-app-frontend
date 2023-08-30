import apiClient from "@/src/apiClient";
import NewTodoForm from "./NewTodoForm";
import TodosTable from "./TodosTable";
import styles from "./page.module.scss";

async function getTodos() {
  const req = await apiClient.api.getTodos({
    format: "json",
    cache: "no-cache",
  });

  return req.data;
}

export default async function Home() {
  const todos = await getTodos();
  return (
    <main className={styles.main}>
      <NewTodoForm />
      <TodosTable todos={todos} />
    </main>
  );
}

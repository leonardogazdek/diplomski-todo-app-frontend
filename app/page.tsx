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
  try {
    var todos = await getTodos();
  } catch (err) {
    return (
      <main className={styles.main}>
        <div
          style={{
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            minHeight: "100vh",
          }}
        >
          <p style={{ flex: 1 }}>Could not load todos</p>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <NewTodoForm />
      <TodosTable todos={todos} />
    </main>
  );
}

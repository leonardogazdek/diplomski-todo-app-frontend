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

export default async function GET() {
  console.log("Primljen zahtjev");
  try {
    var todos = await getTodos();
  } catch (err) {
    console.log(err);
    return (
      <main className={styles.main}>
        <div className={styles.errorContainer}>
          <p style={{ flex: 1 }}>Nemoguće učitati</p>
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

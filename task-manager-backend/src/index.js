import "dotenv/config";
import app from "./app.js";
import tasksRoutes from "./tasks/tasks.routes.js";
import userRoutes from "./users/users.routes.js";

const PORT = process.env.PORT || 3001;

app.use("/api/tasks", tasksRoutes);
app.use("/api/users", userRoutes);

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
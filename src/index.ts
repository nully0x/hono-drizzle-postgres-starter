import { Hono } from "hono";
import { eq } from "drizzle-orm";
import { db } from "./db/migrate";
import { users } from "./db/schema";

// Hono app
const app = new Hono();

// Endpoints
app.get("/", (c) => c.json({ message: "Hello, world!" }));

app.get("/users", async (c) => {
  try {
    const result = await db.select().from(users);
    return c.json(result);
  } catch (error) {
    console.error("Error fetching users:", error);
    return c.text("Error fetching users", 500);
  }
});

app.post("/users", async (c) => {
  try {
    const { name, email } = await c.req.json();
    const result = await db.insert(users).values({ name, email }).returning();
    return c.json(result[0], 201);
  } catch (error) {
    console.error("Error creating user:", error);
    return c.text("Error creating user", 500);
  }
});

app.get("/users/:id", async (c) => {
  const id = parseInt(c.req.param("id"));
  try {
    const result = await db.select().from(users).where(eq(users.id, id));
    if (result.length === 0) {
      return c.text("User not found", 404);
    }
    return c.json(result[0]);
  } catch (error) {
    console.error("Error fetching user:", error);
    return c.text("Error fetching user", 500);
  }
});

export default app;

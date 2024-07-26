import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

// initialize import variables
const app = express();
const port = 3000;
const client = new pg.Client({
  user: "postgres",
  password: "Jalapeno.70",
  host: "localhost",
  port: 5432,
  database: "permalist",
});
let items = [
  { id: 1, title: "Buy milk" },
  { id: 2, title: "Finish homework" },
];

// initialize helpers
client.connect();
async function getItems() {
  try {
    const result = await client.query("SELECT * FROM items ORDER BY id ASC");
    items = result.rows;
  } catch (err) {
    console.error("Failed to get items", err.stack);
  }
}

// initialize middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// initialize route-handlers
app.get("/", async (req, res) => {
  await getItems();
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });
});

app.post("/add", async (req, res) => {
  try {
    const item = req.body.newItem;
    await client.query("INSERT INTO items (title) VALUES ($1)", [item]);
    res.redirect("/");
  } catch (err) {
    console.error("Failed to add item", err.stack);
  }
});

app.post("/edit", async (req, res) => {
  try {
    const id = req.body.updatedItemId;
    const newTitle = req.body.updatedItemTitle;
    await client.query("UPDATE items SET title = $2 WHERE id = $1", [
      id,
      newTitle,
    ]);
    res.redirect("/");
  } catch (err) {
    console.error("Failed to update item".err.stack);
  }
});

app.post("/delete", async (req, res) => {
  try {
    const id = req.body.deleteItemId;
    await client.query("DELETE FROM items WHERE id = $1", [id]);
    res.redirect("/");
  } catch (err) {
    console.error("Failed to delete item", err.stack);
  }
});

// start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

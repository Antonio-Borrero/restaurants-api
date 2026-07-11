import express from "express";
import restaurantRouter from "./routes/restaurant.routes.ts";
import categoryRouter from "./routes/category.routes.ts";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
	res.json({ mensaje: "API funcionando" });
});

app.use("/restaurants", restaurantRouter);
app.use("/restaurants/:id/categories", categoryRouter);

export default app;

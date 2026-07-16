import express from "express";
import restaurantRouter from "./routes/restaurant.routes.ts";
import categoryRouter from "./routes/category.routes.ts";
import { errorHandler } from "./middlewares/errorHandler.ts";
import { categoryDishRouter, dishRouter } from "./routes/dish.routes.ts";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
	res.json({ mensaje: "API funcionando" });
});

app.use("/restaurants", restaurantRouter);
app.use("/restaurants/:restaurantId/categories", categoryRouter);
app.use("/categories/:categoryId/dishes", categoryDishRouter);
app.use("/dishes", dishRouter);

app.use(errorHandler);
export default app;

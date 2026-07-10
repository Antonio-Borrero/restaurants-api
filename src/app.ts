import express from "express";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
	res.json({ mensaje: "API funcionando" });
});

export default app;

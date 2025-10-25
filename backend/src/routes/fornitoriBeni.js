import express from "express";
import { v4 as uuid } from "uuid";

const router = express.Router();
const db = {};

router.get("/", (req, res) => {
  const companyId = req.header("x-company-id");
  if (!db[companyId]) db[companyId] = [];
  res.json(db[companyId]);
});

router.post("/", (req, res) => {
  const companyId = req.header("x-company-id");
  const nuovo = { id: uuid(), ...req.body };
  if (!db[companyId]) db[companyId] = [];
  db[companyId].push(nuovo);
  res.status(201).json(nuovo);
});

router.delete("/:id", (req, res) => {
  const companyId = req.header("x-company-id");
  if (!db[companyId]) db[companyId] = [];
  db[companyId] = db[companyId].filter((f) => f.id !== req.params.id);
  res.status(204).end();
});

export default router;

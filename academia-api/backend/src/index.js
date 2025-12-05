const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "API Academia funcionando!" });
});

// ========== MEMBROS (5 endpoints) ==========
app.get("/membros", async (req, res) => {
  const membros = await prisma.membro.findMany();
  res.json(membros);
});

app.get("/membros/:id", async (req, res) => {
  const membro = await prisma.membro.findUnique({
    where: { id: parseInt(req.params.id) },
    include: { plano: true }
  });
  res.json(membro);
});

app.post("/membros", async (req, res) => {
  const membro = await prisma.membro.create({ data: req.body });
  res.status(201).json(membro);
});

app.put("/membros/:id", async (req, res) => {
  const membro = await prisma.membro.update({
    where: { id: parseInt(req.params.id) },
    data: req.body
  });
  res.json(membro);
});

app.delete("/membros/:id", async (req, res) => {
  await prisma.membro.delete({ where: { id: parseInt(req.params.id) } });
  res.json({ message: "Membro deletado" });
});

// ========== PLANOS (5 endpoints) ==========
app.get("/planos", async (req, res) => {
  const planos = await prisma.plano.findMany({
    include: {
      _count: { select: { membros: true } },
      exercicios: true
    }
  });
  res.json(planos);
});

app.get("/planos/:id", async (req, res) => {
  const plano = await prisma.plano.findUnique({
    where: { id: parseInt(req.params.id) },
    include: { membros: true, exercicios: true }
  });
  res.json(plano);
});

app.post("/planos", async (req, res) => {
  const plano = await prisma.plano.create({ data: req.body });
  res.status(201).json(plano);
});

app.put("/planos/:id", async (req, res) => {
  const plano = await prisma.plano.update({
    where: { id: parseInt(req.params.id) },
    data: req.body
  });
  res.json(plano);
});

app.delete("/planos/:id", async (req, res) => {
  await prisma.plano.delete({ where: { id: parseInt(req.params.id) } });
  res.json({ message: "Plano deletado" });
});

// ========== EXERCICIOS (5 endpoints) ==========
app.get("/exercicios", async (req, res) => {
  const exercicios = await prisma.exercicio.findMany();
  res.json(exercicios);
});

app.get("/exercicios/:id", async (req, res) => {
  const exercicio = await prisma.exercicio.findUnique({
    where: { id: parseInt(req.params.id) }
  });
  res.json(exercicio);
});

app.post("/exercicios", async (req, res) => {
  const exercicio = await prisma.exercicio.create({ data: req.body });
  res.status(201).json(exercicio);
});

app.put("/exercicios/:id", async (req, res) => {
  const exercicio = await prisma.exercicio.update({
    where: { id: parseInt(req.params.id) },
    data: req.body
  });
  res.json(exercicio);
});

app.delete("/exercicios/:id", async (req, res) => {
  await prisma.exercicio.delete({ where: { id: parseInt(req.params.id) } });
  res.json({ message: "Exercicio deletado" });
});

// ========== ENDPOINT ESPECIAL ==========
app.get("/estatisticas", async (req, res) => {
  const planos = await prisma.plano.findMany({
    include: {
      _count: { select: { membros: true } },
      exercicios: true,
      membros: { select: { nome: true, idade: true } }
    }
  });

  const resultado = planos.map(plano => ({
    plano: plano.nome,
    totalMembros: plano._count.membros,
    treinador: plano.treinador,
    preco: plano.preco,
    exercicios: plano.exercicios,
    membros: plano.membros
  }));

  res.json(resultado);
});

app.listen(3000, () => {
  console.log("?? Backend rodando: http://localhost:3000");
  console.log("?? Estat?sticas: http://localhost:3000/estatisticas");
  console.log("?? Membros: http://localhost:3000/membros");
});

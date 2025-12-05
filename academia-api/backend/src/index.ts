import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

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
  try {
    const membros = await prisma.membro.findMany();
    res.json(membros);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar membros" });
  }
});

app.get("/membros/:id", async (req, res) => {
  try {
    const membro = await prisma.membro.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { plano: true }
    });
    res.json(membro);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar membro" });
  }
});

app.post("/membros", async (req, res) => {
  try {
    const { nome, email, idade, planoId } = req.body;
    const membro = await prisma.membro.create({ 
      data: { 
        nome, 
        email, 
        idade: parseInt(idade), 
        planoId: parseInt(planoId) 
      }
    });
    res.status(201).json(membro);
  } catch (error) {
    res.status(400).json({ error: "Dados inv?lidos" });
  }
});

app.put("/membros/:id", async (req, res) => {
  try {
    const { nome, email, idade, planoId } = req.body;
    const membro = await prisma.membro.update({
      where: { id: parseInt(req.params.id) },
      data: { 
        nome, 
        email, 
        idade: idade ? parseInt(idade) : undefined, 
        planoId: planoId ? parseInt(planoId) : undefined 
      }
    });
    res.json(membro);
  } catch (error) {
    res.status(400).json({ error: "Dados inv?lidos" });
  }
});

app.delete("/membros/:id", async (req, res) => {
  try {
    await prisma.membro.delete({ 
      where: { id: parseInt(req.params.id) } 
    });
    res.json({ message: "Membro deletado" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao deletar membro" });
  }
});

// ========== PLANOS (5 endpoints) ==========
app.get("/planos", async (req, res) => {
  try {
    const planos = await prisma.plano.findMany({
      include: {
        _count: { select: { membros: true } },
        exercicios: true
      }
    });
    res.json(planos);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar planos" });
  }
});

app.get("/planos/:id", async (req, res) => {
  try {
    const plano = await prisma.plano.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { membros: true, exercicios: true }
    });
    res.json(plano);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar plano" });
  }
});

app.post("/planos", async (req, res) => {
  try {
    const { nome, preco, treinador } = req.body;
    const plano = await prisma.plano.create({ 
      data: { 
        nome, 
        preco: parseFloat(preco), 
        treinador 
      }
    });
    res.status(201).json(plano);
  } catch (error) {
    res.status(400).json({ error: "Dados inv?lidos" });
  }
});

app.put("/planos/:id", async (req, res) => {
  try {
    const { nome, preco, treinador } = req.body;
    const plano = await prisma.plano.update({
      where: { id: parseInt(req.params.id) },
      data: { 
        nome, 
        preco: preco ? parseFloat(preco) : undefined, 
        treinador 
      }
    });
    res.json(plano);
  } catch (error) {
    res.status(400).json({ error: "Dados inv?lidos" });
  }
});

app.delete("/planos/:id", async (req, res) => {
  try {
    await prisma.plano.delete({ 
      where: { id: parseInt(req.params.id) } 
    });
    res.json({ message: "Plano deletado" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao deletar plano" });
  }
});

// ========== EXERCICIOS (5 endpoints) ==========
app.get("/exercicios", async (req, res) => {
  try {
    const exercicios = await prisma.exercicio.findMany();
    res.json(exercicios);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar exerc?cios" });
  }
});

app.get("/exercicios/:id", async (req, res) => {
  try {
    const exercicio = await prisma.exercicio.findUnique({
      where: { id: parseInt(req.params.id) }
    });
    res.json(exercicio);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar exerc?cio" });
  }
});

app.post("/exercicios", async (req, res) => {
  try {
    const { nome, descricao, planoId } = req.body;
    const exercicio = await prisma.exercicio.create({ 
      data: { 
        nome, 
        descricao, 
        planoId: parseInt(planoId) 
      }
    });
    res.status(201).json(exercicio);
  } catch (error) {
    res.status(400).json({ error: "Dados inv?lidos" });
  }
});

app.put("/exercicios/:id", async (req, res) => {
  try {
    const { nome, descricao, planoId } = req.body;
    const exercicio = await prisma.exercicio.update({
      where: { id: parseInt(req.params.id) },
      data: { 
        nome, 
        descricao, 
        planoId: planoId ? parseInt(planoId) : undefined 
      }
    });
    res.json(exercicio);
  } catch (error) {
    res.status(400).json({ error: "Dados inv?lidos" });
  }
});

app.delete("/exercicios/:id", async (req, res) => {
  try {
    await prisma.exercicio.delete({ 
      where: { id: parseInt(req.params.id) } 
    });
    res.json({ message: "Exerc?cio deletado" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao deletar exerc?cio" });
  }
});

// ========== ENDPOINT ESPECIAL ==========
app.get("/estatisticas", async (req, res) => {
  try {
    const planos = await prisma.plano.findMany({
      include: {
        _count: { select: { membros: true } },
        exercicios: true,
        membros: { 
          select: { 
            nome: true, 
            idade: true 
          } 
        }
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
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar estat?sticas" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`?? Backend TypeScript rodando: http://localhost:${PORT}`);
  console.log(`?? Estat?sticas: http://localhost:${PORT}/estatisticas`);
  console.log(`?? Membros: http://localhost:${PORT}/membros`);
  console.log(`?? Health Check: http://localhost:${PORT}/health`);
});

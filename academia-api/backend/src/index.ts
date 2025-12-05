import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import { membroSchema, planoSchema, exercicioSchema } from "./validations/schemas";

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// ========== CONFIGURA??O SWAGGER ==========
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Academia FitPro",
      version: "1.0.0",
      description: "API para gerenciamento de academia com TypeScript, Prisma e PostgreSQL",
      contact: {
        name: "API Support",
        email: "support@academia.com"
      },
      license: {
        name: "MIT",
        url: "https://opensource.org/licenses/MIT"
      }
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Servidor de desenvolvimento"
      }
    ],
    tags: [
      { name: "Membros", description: "Opera??es relacionadas a membros" },
      { name: "Planos", description: "Opera??es relacionadas a planos" },
      { name: "Exerc?cios", description: "Opera??es relacionadas a exerc?cios" },
      { name: "Estat?sticas", description: "Estat?sticas da academia" }
    ],
    components: {
      schemas: {
        Membro: {
          type: "object",
          required: ["nome", "email", "idade", "planoId"],
          properties: {
            id: { type: "integer", example: 1 },
            nome: { type: "string", example: "Jo?o Silva" },
            email: { type: "string", example: "joao@email.com" },
            idade: { type: "integer", example: 25 },
            planoId: { type: "integer", example: 1 },
            createdAt: { type: "string", format: "date-time" }
          }
        },
        Plano: {
          type: "object",
          required: ["nome", "preco", "treinador"],
          properties: {
            id: { type: "integer", example: 1 },
            nome: { type: "string", enum: ["normal", "premium", "platina"], example: "normal" },
            preco: { type: "number", example: 89.90 },
            treinador: { type: "string", example: "Balestrin" }
          }
        },
        Exercicio: {
          type: "object",
          required: ["nome", "descricao", "planoId"],
          properties: {
            id: { type: "integer", example: 1 },
            nome: { type: "string", example: "Supino Reto" },
            descricao: { type: "string", example: "Exerc?cio para peitoral" },
            planoId: { type: "integer", example: 1 }
          }
        },
        Estatistica: {
          type: "object",
          properties: {
            plano: { type: "string", example: "NORMAL" },
            totalMembros: { type: "integer", example: 5 },
            treinador: { type: "string", example: "Balestrin" },
            preco: { type: "number", example: 89.90 },
            exercicios: { type: "array", items: { $ref: "#/components/schemas/Exercicio" } },
            membros: { type: "array", items: { type: "object" } }
          }
        }
      }
    }
  },
  apis: ["./src/index.ts"] // Caminho para o arquivo atual
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ========== ROTAS ==========

/**
 * @swagger
 * /:
 *   get:
 *     summary: P?gina inicial da API
 *     tags: [Home]
 *     responses:
 *       200:
 *         description: API funcionando
 */
app.get("/", (req, res) => {
  res.json({
    message: "?? API Academia FitPro - TypeScript + Prisma + PostgreSQL",
    documentation: "/api-docs",
    endpoints: {
      estatisticas: "/estatisticas",
      membros: "/membros",
      planos: "/planos",
      exercicios: "/exercicios",
      health: "/health"
    }
  });
});

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check da API
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API est? funcionando
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    message: "API Academia funcionando!",
    timestamp: new Date().toISOString(),
    database: "SQLite com Prisma"
  });
});

// ========== MEMBROS ==========

/**
 * @swagger
 * /membros:
 *   get:
 *     summary: Retorna todos os membros
 *     tags: [Membros]
 *     responses:
 *       200:
 *         description: Lista de membros
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Membro'
 */
app.get("/membros", async (req, res) => {
  try {
    const membros = await prisma.membro.findMany();
    res.json(membros);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar membros" });
  }
});

/**
 * @swagger
 * /membros/{id}:
 *   get:
 *     summary: Retorna um membro pelo ID
 *     tags: [Membros]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do membro
 *     responses:
 *       200:
 *         description: Membro encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Membro'
 *       404:
 *         description: Membro n?o encontrado
 */
app.get("/membros/:id", async (req, res) => {
  try {
    const membro = await prisma.membro.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { plano: true }
    });
    
    if (!membro) {
      return res.status(404).json({ error: "Membro n?o encontrado" });
    }
    
    res.json(membro);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar membro" });
  }
});

/**
 * @swagger
 * /membros:
 *   post:
 *     summary: Cria um novo membro
 *     tags: [Membros]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Membro'
 *     responses:
 *       201:
 *         description: Membro criado com sucesso
 *       400:
 *         description: Dados inv?lidos
 */
app.post("/membros", async (req, res) => {
  try {
    const validatedData = membroSchema.parse(req.body);
    const membro = await prisma.membro.create({ 
      data: validatedData
    });
    res.status(201).json(membro);
  } catch (error: any) {
    if (error.name === "ZodError") {
      res.status(400).json({ 
        error: "Valida??o falhou", 
        details: error.errors 
      });
    } else {
      res.status(400).json({ error: "Dados inv?lidos" });
    }
  }
});

/**
 * @swagger
 * /membros/{id}:
 *   put:
 *     summary: Atualiza um membro existente
 *     tags: [Membros]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Membro'
 *     responses:
 *       200:
 *         description: Membro atualizado
 *       404:
 *         description: Membro n?o encontrado
 */
app.put("/membros/:id", async (req, res) => {
  try {
    const validatedData = membroSchema.partial().parse(req.body);
    const membro = await prisma.membro.update({
      where: { id: parseInt(req.params.id) },
      data: validatedData
    });
    res.json(membro);
  } catch (error: any) {
    if (error.name === "ZodError") {
      res.status(400).json({ 
        error: "Valida??o falhou", 
        details: error.errors 
      });
    } else {
      res.status(400).json({ error: "Dados inv?lidos" });
    }
  }
});

/**
 * @swagger
 * /membros/{id}:
 *   delete:
 *     summary: Remove um membro
 *     tags: [Membros]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Membro removido
 *       404:
 *         description: Membro n?o encontrado
 */
app.delete("/membros/:id", async (req, res) => {
  try {
    await prisma.membro.delete({ 
      where: { id: parseInt(req.params.id) } 
    });
    res.json({ message: "Membro deletado com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao deletar membro" });
  }
});

// ========== PLANOS ==========

/**
 * @swagger
 * /planos:
 *   get:
 *     summary: Retorna todos os planos
 *     tags: [Planos]
 *     responses:
 *       200:
 *         description: Lista de planos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Plano'
 */
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

/**
 * @swagger
 * /planos/{id}:
 *   get:
 *     summary: Retorna um plano pelo ID
 *     tags: [Planos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Plano encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Plano'
 */
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

/**
 * @swagger
 * /planos:
 *   post:
 *     summary: Cria um novo plano
 *     tags: [Planos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Plano'
 *     responses:
 *       201:
 *         description: Plano criado com sucesso
 */
app.post("/planos", async (req, res) => {
  try {
    const validatedData = planoSchema.parse(req.body);
    const plano = await prisma.plano.create({ 
      data: validatedData
    });
    res.status(201).json(plano);
  } catch (error: any) {
    if (error.name === "ZodError") {
      res.status(400).json({ 
        error: "Valida??o falhou", 
        details: error.errors 
      });
    } else {
      res.status(400).json({ error: "Dados inv?lidos" });
    }
  }
});

/**
 * @swagger
 * /planos/{id}:
 *   put:
 *     summary: Atualiza um plano existente
 *     tags: [Planos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Plano'
 *     responses:
 *       200:
 *         description: Plano atualizado
 */
app.put("/planos/:id", async (req, res) => {
  try {
    const validatedData = planoSchema.partial().parse(req.body);
    const plano = await prisma.plano.update({
      where: { id: parseInt(req.params.id) },
      data: validatedData
    });
    res.json(plano);
  } catch (error: any) {
    if (error.name === "ZodError") {
      res.status(400).json({ 
        error: "Valida??o falhou", 
        details: error.errors 
      });
    } else {
      res.status(400).json({ error: "Dados inv?lidos" });
    }
  }
});

/**
 * @swagger
 * /planos/{id}:
 *   delete:
 *     summary: Remove um plano
 *     tags: [Planos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Plano removido
 */
app.delete("/planos/:id", async (req, res) => {
  try {
    await prisma.plano.delete({ 
      where: { id: parseInt(req.params.id) } 
    });
    res.json({ message: "Plano deletado com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao deletar plano" });
  }
});

// ========== EXERC?CIOS ==========

/**
 * @swagger
 * /exercicios:
 *   get:
 *     summary: Retorna todos os exerc?cios
 *     tags: [Exerc?cios]
 *     responses:
 *       200:
 *         description: Lista de exerc?cios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Exercicio'
 */
app.get("/exercicios", async (req, res) => {
  try {
    const exercicios = await prisma.exercicio.findMany();
    res.json(exercicios);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar exerc?cios" });
  }
});

/**
 * @swagger
 * /exercicios/{id}:
 *   get:
 *     summary: Retorna um exerc?cio pelo ID
 *     tags: [Exerc?cios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Exerc?cio encontrado
 */
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

/**
 * @swagger
 * /exercicios:
 *   post:
 *     summary: Cria um novo exerc?cio
 *     tags: [Exerc?cios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Exercicio'
 *     responses:
 *       201:
 *         description: Exerc?cio criado com sucesso
 */
app.post("/exercicios", async (req, res) => {
  try {
    const validatedData = exercicioSchema.parse(req.body);
    const exercicio = await prisma.exercicio.create({ 
      data: validatedData
    });
    res.status(201).json(exercicio);
  } catch (error: any) {
    if (error.name === "ZodError") {
      res.status(400).json({ 
        error: "Valida??o falhou", 
        details: error.errors 
      });
    } else {
      res.status(400).json({ error: "Dados inv?lidos" });
    }
  }
});

/**
 * @swagger
 * /exercicios/{id}:
 *   put:
 *     summary: Atualiza um exerc?cio existente
 *     tags: [Exerc?cios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Exercicio'
 *     responses:
 *       200:
 *         description: Exerc?cio atualizado
 */
app.put("/exercicios/:id", async (req, res) => {
  try {
    const validatedData = exercicioSchema.partial().parse(req.body);
    const exercicio = await prisma.exercicio.update({
      where: { id: parseInt(req.params.id) },
      data: validatedData
    });
    res.json(exercicio);
  } catch (error: any) {
    if (error.name === "ZodError") {
      res.status(400).json({ 
        error: "Valida??o falhou", 
        details: error.errors 
      });
    } else {
      res.status(400).json({ error: "Dados inv?lidos" });
    }
  }
});

/**
 * @swagger
 * /exercicios/{id}:
 *   delete:
 *     summary: Remove um exerc?cio
 *     tags: [Exerc?cios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Exerc?cio removido
 */
app.delete("/exercicios/:id", async (req, res) => {
  try {
    await prisma.exercicio.delete({ 
      where: { id: parseInt(req.params.id) } 
    });
    res.json({ message: "Exerc?cio deletado com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao deletar exerc?cio" });
  }
});

// ========== ENDPOINT ESPECIAL ==========

/**
 * @swagger
 * /estatisticas:
 *   get:
 *     summary: Retorna estat?sticas completas da academia
 *     tags: [Estat?sticas]
 *     description: Mostra quantos membros tem em cada plano, treinador respons?vel e exerc?cios recomendados
 *     responses:
 *       200:
 *         description: Estat?sticas retornadas com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Estatistica'
 */
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
      plano: plano.nome.toUpperCase(),
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

// ========== INICIAR SERVIDOR ==========
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`?? Backend TypeScript rodando: http://localhost:${PORT}`);
  console.log(`?? Swagger Documentation: http://localhost:${PORT}/api-docs`);
  console.log(`?? Estat?sticas: http://localhost:${PORT}/estatisticas`);
  console.log(`?? Membros: http://localhost:${PORT}/membros`);
  console.log(`?? Health Check: http://localhost:${PORT}/health`);
});

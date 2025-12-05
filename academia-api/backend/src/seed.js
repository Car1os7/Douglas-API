const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // Limpar dados
  await prisma.exercicio.deleteMany();
  await prisma.membro.deleteMany();
  await prisma.plano.deleteMany();

  // Criar planos com treinadores
  const planos = await Promise.all([
    prisma.plano.create({ 
      data: { 
        nome: "normal", 
        preco: 89.90, 
        treinador: "Balestrin" 
      } 
    }),
    prisma.plano.create({ 
      data: { 
        nome: "premium", 
        preco: 129.90, 
        treinador: "Leo Stronda" 
      } 
    }),
    prisma.plano.create({ 
      data: { 
        nome: "platina", 
        preco: 199.90, 
        treinador: "Carla?o" 
      } 
    })
  ]);

  // Criar exerc?cios
  await Promise.all([
    prisma.exercicio.create({ 
      data: { 
        nome: "Supino Reto", 
        descricao: "Para peitoral", 
        planoId: planos[0].id 
      } 
    }),
    prisma.exercicio.create({ 
      data: { 
        nome: "Agachamento", 
        descricao: "Para pernas", 
        planoId: planos[1].id 
      } 
    }),
    prisma.exercicio.create({ 
      data: { 
        nome: "Barra Fixa", 
        descricao: "Para costas", 
        planoId: planos[2].id 
      } 
    })
  ]);

  // Criar membros
  await Promise.all([
    prisma.membro.create({ 
      data: { 
        nome: "Jo?o Silva", 
        email: "joao@email.com", 
        idade: 25, 
        planoId: planos[0].id 
      } 
    }),
    prisma.membro.create({ 
      data: { 
        nome: "Maria Santos", 
        email: "maria@email.com", 
        idade: 30, 
        planoId: planos[0].id 
      } 
    }),
    prisma.membro.create({ 
      data: { 
        nome: "Carlos Oliveira", 
        email: "carlos@email.com", 
        idade: 22, 
        planoId: planos[1].id 
      } 
    }),
    prisma.membro.create({ 
      data: { 
        nome: "Ana Costa", 
        email: "ana@email.com", 
        idade: 28, 
        planoId: planos[2].id 
      } 
    })
  ]);

  console.log("? Dados criados!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

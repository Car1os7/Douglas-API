import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("?? Iniciando seed...");

  // Limpar dados
  await prisma.exercicio.deleteMany();
  await prisma.membro.deleteMany();
  await prisma.plano.deleteMany();

  // Criar planos
  const plano1 = await prisma.plano.create({ 
    data: { 
      nome: "normal", 
      preco: 89.90, 
      treinador: "Balestrin" 
    } 
  });
  
  const plano2 = await prisma.plano.create({ 
    data: { 
      nome: "premium", 
      preco: 129.90, 
      treinador: "Leo Stronda" 
    } 
  });
  
  const plano3 = await prisma.plano.create({ 
    data: { 
      nome: "platina", 
      preco: 199.90, 
      treinador: "Carla?o" 
    } 
  });

  console.log("? Planos criados");

  // Criar exerc?cios
  await prisma.exercicio.create({ 
    data: { 
      nome: "Supino Reto", 
      descricao: "Desenvolvimento para peitoral", 
      planoId: plano1.id 
    } 
  });
  
  await prisma.exercicio.create({ 
    data: { 
      nome: "Agachamento Livre", 
      descricao: "Para desenvolvimento de pernas", 
      planoId: plano2.id 
    } 
  });
  
  await prisma.exercicio.create({ 
    data: { 
      nome: "Barra Fixa", 
      descricao: "Para desenvolvimento dorsal", 
      planoId: plano3.id 
    } 
  });

  console.log("? Exerc?cios criados");

  // Criar membros
  await prisma.membro.create({ 
    data: { 
      nome: "Jo?o Silva", 
      email: "joao@email.com", 
      idade: 25, 
      planoId: plano1.id 
    } 
  });
  
  await prisma.membro.create({ 
    data: { 
      nome: "Maria Santos", 
      email: "maria@email.com", 
      idade: 30, 
      planoId: plano1.id 
    } 
  });
  
  await prisma.membro.create({ 
    data: { 
      nome: "Carlos Oliveira", 
      email: "carlos@email.com", 
      idade: 22, 
      planoId: plano2.id 
    } 
  });
  
  await prisma.membro.create({ 
    data: { 
      nome: "Ana Costa", 
      email: "ana@email.com", 
      idade: 28, 
      planoId: plano3.id 
    } 
  });

  console.log("? Membros criados");
  console.log("?? Seed finalizado com sucesso!");
}

main()
  .catch((e) => {
    console.error("? Erro no seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

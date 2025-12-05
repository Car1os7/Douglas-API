-- CreateTable
CREATE TABLE "Membro" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "idade" INTEGER NOT NULL,
    "planoId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Membro_planoId_fkey" FOREIGN KEY ("planoId") REFERENCES "Plano" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Plano" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "preco" REAL NOT NULL,
    "treinador" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Exercicio" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "planoId" INTEGER NOT NULL,
    CONSTRAINT "Exercicio_planoId_fkey" FOREIGN KEY ("planoId") REFERENCES "Plano" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Membro_email_key" ON "Membro"("email");

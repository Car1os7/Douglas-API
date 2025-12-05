import { z } from "zod";

// Schema para Membro
export const membroSchema = z.object({
  nome: z.string()
    .min(3, "Nome deve ter no m?nimo 3 caracteres")
    .max(100, "Nome deve ter no m?ximo 100 caracteres"),
  email: z.string()
    .email("Email inv?lido")
    .max(100, "Email deve ter no m?ximo 100 caracteres"),
  idade: z.number()
    .int("Idade deve ser um n?mero inteiro")
    .min(16, "Idade m?nima ? 16 anos")
    .max(100, "Idade m?xima ? 100 anos"),
  planoId: z.number()
    .int("Plano ID deve ser um n?mero inteiro")
    .positive("Plano ID deve ser positivo")
});

// Schema para Plano
export const planoSchema = z.object({
  nome: z.enum(["normal", "premium", "platina"], {
    errorMap: () => ({ message: "Plano deve ser: normal, premium ou platina" })
  }),
  preco: z.number()
    .positive("Pre?o deve ser positivo")
    .min(0.01, "Pre?o m?nimo ? R$ 0,01"),
  treinador: z.string()
    .min(3, "Treinador deve ter no m?nimo 3 caracteres")
    .max(100, "Treinador deve ter no m?ximo 100 caracteres")
});

// Schema para Exerc?cio
export const exercicioSchema = z.object({
  nome: z.string()
    .min(3, "Nome deve ter no m?nimo 3 caracteres")
    .max(100, "Nome deve ter no m?ximo 100 caracteres"),
  descricao: z.string()
    .min(5, "Descri??o deve ter no m?nimo 5 caracteres")
    .max(500, "Descri??o deve ter no m?ximo 500 caracteres"),
  planoId: z.number()
    .int("Plano ID deve ser um n?mero inteiro")
    .positive("Plano ID deve ser positivo")
});

// Tipos TypeScript inferidos dos schemas
export type MembroInput = z.infer<typeof membroSchema>;
export type PlanoInput = z.infer<typeof planoSchema>;
export type ExercicioInput = z.infer<typeof exercicioSchema>;

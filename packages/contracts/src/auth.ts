import { z } from 'zod';

export const euResponseSchema = z.object({
  pessoa: z.object({
    id: z.string(),
    email: z.string(),
    nome: z.string(),
  }),
});

export type EuResponse = z.infer<typeof euResponseSchema>;

export const aceite18RequestSchema = z.object({
  tenho18: z.literal(true),
});

export type Aceite18Request = z.infer<typeof aceite18RequestSchema>;

export const erroApiSchema = z.object({
  erro: z.enum(['sem_sessao', 'aceite_18_pendente', 'nao_encontrado', 'pedido_invalido']),
});

export type ErroApi = z.infer<typeof erroApiSchema>;

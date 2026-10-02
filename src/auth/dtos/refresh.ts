import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { z } from 'zod';

export const RefreshSchema = z.object({
  refreshToken: z
    .string({ message: 'O refresh token é obrigatório' })
    .min(1, { message: 'O refresh token não pode estar vazio' })
    // JWT tem 3 partes separadas por ponto: header.payload.signature
    // Validação básica: precisa ter pelo menos 2 pontos
    .refine((val) => val.split('.').length === 3, {
      message: 'Formato de JWT inválido',
    }),
});

export type RefreshDto = z.infer<typeof RefreshSchema>;
export const RefreshPipe = new ZodValidationPipe(RefreshSchema);

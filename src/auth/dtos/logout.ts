import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { z } from 'zod';

export const LogoutSchema = z.object({
  refreshToken: z
    .string({ message: 'O refresh token é obrigatório' })
    .min(1, { message: 'O refresh token não pode estar vazio' }),
});

export type LogoutDto = z.infer<typeof LogoutSchema>;
export const LogoutPipe = new ZodValidationPipe(LogoutSchema);

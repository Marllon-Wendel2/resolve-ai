import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { z } from 'zod';

export const LoginSchema = z.object({
  email: z
    .string({ message: 'O e-mail é obrigatório' })
    .email({ message: 'E-mail inválido' })
    .optional(),
  userName: z
    .string({ message: 'O nome de usuário é obrigatório' })
    .min(1, { message: 'O nome de usuário não pode estar vazio' })
    .optional(),
  password: z
    .string({ message: 'A senha é obrigatória' })
    .min(1, { message: 'A senha não pode estar vazia' }),
});

export type LoginDto = z.infer<typeof LoginSchema>;
export const LoginPipe = new ZodValidationPipe(LoginSchema);

import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { z } from 'zod';

export const createUserSchema = z.object({
  email: z.string().email({ message: 'Email inválido' }),
  name: z.string().min(3, { message: 'Nome deve ter no mínimo 3 caracteres' }),
  userName: z
    .string()
    .min(3, { message: 'Nome de usuário deve ter no mínimo 3 caracteres' }),
  password: z
    .string()
    .min(8, { message: 'A senha deve ter no mínimo 8 caracteres' })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/, {
      message:
        'A senha deve conter pelo menos uma letra maiúscula, uma minúscula, um número e um caractere especial',
    }),
});

export type CreateUserDto = z.infer<typeof createUserSchema>;
export const CreateUserPipe = new ZodValidationPipe(createUserSchema);

export const updateUserSchema = createUserSchema.partial();
export type UpdateUserDto = z.infer<typeof updateUserSchema>;
export const UpdateUserPipe = new ZodValidationPipe(updateUserSchema);

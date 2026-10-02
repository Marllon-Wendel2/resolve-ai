import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import z from 'zod';

const solicitacionSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  description: z.string().optional(),
  category: z.enum(['TI', 'TH', 'Sales', 'Finance', 'Infra']),
  status: z.enum(['Open', 'InProgress', 'Closed']).optional(),
});

export type CreateSolitacionDto = z.infer<typeof solicitacionSchema>;
export const createSolicitationPipe = new ZodValidationPipe(solicitacionSchema);

const updateSolicitacionSchema = solicitacionSchema.partial();
export type UpdateSolitacionDto = z.infer<typeof updateSolicitacionSchema>;
export const updateSolicitationPipe = new ZodValidationPipe(
  updateSolicitacionSchema,
);

import {
  ConflictException,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

export function handlePrismaError(error: any): never {
  if (error && typeof error.code === 'string') {
    switch (error.code) {
      case 'P2002': {
        const target = error.meta?.target;
        const field = Array.isArray(target) ? target.join(', ') : 'campo';
        throw new ConflictException(
          `Já existe um registro com este valor para o campo: ${field}`,
        );
      }
      case 'P2025': {
        throw new NotFoundException('Registro não encontrado.');
      }
      case 'P2003': {
        throw new BadRequestException(
          'Violação de chave estrangeira: O registro relacionado não existe.',
        );
      }
      default:
        break;
    }
  }
  console.error('Erro desconhecido do Prisma:', error);
  throw new InternalServerErrorException(
    'Ocorreu um erro interno no servidor.',
  );
}

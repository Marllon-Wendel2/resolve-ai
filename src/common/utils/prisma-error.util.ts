import {
  ConflictException,
  HttpException,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

interface PrismaKnownError {
  code: string;
  meta?: { target?: unknown };
}

function isPrismaKnownError(error: unknown): error is PrismaKnownError {
  return (
    typeof error === 'object' &&
    error !== null &&
    typeof (error as { code?: unknown }).code === 'string'
  );
}

export function handlePrismaError(error: unknown): never {
  if (error instanceof HttpException) {
    throw error;
  }

  if (isPrismaKnownError(error)) {
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

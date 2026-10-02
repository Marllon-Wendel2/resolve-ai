import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { hashPassword } from 'src/common/utils/hash.util';
import { handlePrismaError } from 'src/common/utils/prisma-error.util';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async createUser(createUserDto: CreateUserDto) {
    try {
      const hashedPassword = await hashPassword(createUserDto.password);
      return await this.prismaService.user.create({
        data: {
          email: createUserDto.email,
          name: createUserDto.name,
          hashPassword: hashedPassword,
        },
        omit: { hashPassword: true },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async findAllUsers() {
    try {
      const users = await this.prismaService.user.findMany({
        omit: { hashPassword: true },
      });
      if (users.length === 0) {
        throw new InternalServerErrorException('Nenhum usuário encontrado');
      }
      return users;
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async findUserById(id: string) {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { id },
        omit: { hashPassword: true },
      });
      if (!user) {
        throw new InternalServerErrorException('Usuário não encontrado');
      }
      return user;
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    try {
      if (updateUserDto.password) {
        throw new InternalServerErrorException(
          'Não é permitido atualizar a senha diretamente. Use o endpoint de alteração de senha.',
        );
      }
      const updatedUser = await this.prismaService.user.update({
        where: { id },
        data: updateUserDto,
      });
      return updatedUser;
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async removeUser(id: string) {
    try {
      return await this.prismaService.user.delete({
        where: { id },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }
}

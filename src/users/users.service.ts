import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
          username: createUserDto.userName,
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
      return await this.prismaService.user.findMany({
        omit: { hashPassword: true },
      });
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
        throw new NotFoundException('Usuário não encontrado.');
      }
      return user;
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    try {
      if (updateUserDto.password) {
        throw new BadRequestException(
          'Não é permitido atualizar a senha diretamente. Use o endpoint de alteração de senha.',
        );
      }

      const { userName, email, name } = updateUserDto;

      const updatedUser = await this.prismaService.user.update({
        where: { id },
        data: {
          ...(email !== undefined && { email }),
          ...(name !== undefined && { name }),
          ...(userName !== undefined && { username: userName }),
        },
        omit: { hashPassword: true },
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
        omit: { hashPassword: true },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }
}

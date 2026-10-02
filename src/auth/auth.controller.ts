import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { type LoginDto, LoginPipe } from './dtos/login';
import * as refresh from './dtos/refresh';
import { type LogoutDto, LogoutPipe } from './dtos/logout';
import { type RefreshDto } from './dtos/refresh';
import {
  JwtAuthGuard,
  type AuthenticatedRequest,
} from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body(LoginPipe) loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('refresh')
  async refresh(@Body(refresh.RefreshPipe) refreshDto: RefreshDto) {
    return this.authService.refresh(refreshDto.refreshToken);
  }

  @Post('logout')
  async logout(@Body(LogoutPipe) logoutDto: LogoutDto) {
    return this.authService.logout(logoutDto.refreshToken);
  }

  @Post('logout-everywhere')
  @UseGuards(JwtAuthGuard)
  async logoutEverywhere(@Req() req: AuthenticatedRequest) {
    return this.authService.logoutEverywhere(req.user.sub);
  }
}

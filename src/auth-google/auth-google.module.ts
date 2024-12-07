import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { GoogleStrategy } from './auth-google.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/sign-log/entities/user.entity';
import { SignLogModule } from 'src/sign-log/sign-log.module';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'google' }),TypeOrmModule.forFeature([User]),SignLogModule],
  providers: [GoogleStrategy,],
})
export class AuthModule {}

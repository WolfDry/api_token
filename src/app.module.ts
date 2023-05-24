import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenController } from './token/token.controller';
import { User } from './users/entities/user.entity';
import { UsersService } from './users/users.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '5kGF0qhGrDRbk41NRD9I',
      database: 'lab',
      autoLoadEntities: true,
      synchronize: true,
    }),
    UsersModule,
    TypeOrmModule.forFeature([
      User,
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || "banana",
      signOptions: {
        audience: process.env.JWT_AUDIENCE || "my-digital-school",
      }
    })
  ],
  controllers: [AppController, TokenController],
  providers: [AppService, UsersService],
})
export class AppModule { }

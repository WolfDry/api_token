import { Controller, Get, Headers, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs'
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dto/sign-in.dto';

@Controller('token')
export class TokenController {

    constructor(
        private users: UsersService,
        private jwts: JwtService
    ) { }

    @Get()
    async signIn(@Headers("Authorization") auth: string) {
        const args = auth && auth.split(" ")
        if (args && args.length == 2 && args[0] == "Basic") {
            const credentials = Buffer.from(args[1], "base64").toString("utf8").split(":")
            const email = credentials[0]
            const password = credentials[1]
            const user = await this.users.findOneByEmail(email)
            if (user && await bcrypt.compare(password, user.hash)) {
                const cr = new SignInDto()
                cr.grant_type = "password"
                cr.scope = ""
                cr.expires_in = 3600
                cr.access_token = await this.jwts.sign({
                    id: user.id,
                    role: user.role
                }, {
                    subject: email,
                    expiresIn: '1H'
                })
                return cr
            }
        }
        throw new UnauthorizedException()
    }
}

import { Controller,Post } from '@nestjs/common';

@Controller('auth')
export class AuthController {
    @Post("/signup")
    async Signup(){
        
    }
}

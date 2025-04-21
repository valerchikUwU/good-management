import { IsIP, IsNotEmpty, IsString } from 'class-validator';

['fingerprint', 'userAgent', 'ip', 'token'];

export class ClientCredentialsDto {
    @IsString()
    @IsNotEmpty()
    fingerprint: string;

    @IsIP()
    @IsNotEmpty()
    ip: string;

    @IsString()
    @IsNotEmpty()
    userAgent: string;

    @IsString()
    @IsNotEmpty()
    token: string;
}
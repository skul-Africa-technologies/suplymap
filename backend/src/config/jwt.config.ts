import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions, JwtSignOptions } from '@nestjs/jwt';

type Expiration = NonNullable<JwtSignOptions['expiresIn']>;

const expiresIn = (configService: ConfigService, key: string): Expiration =>
  configService.getOrThrow<string>(key) as Expiration;

export const jwtConfig = (configService: ConfigService): JwtModuleOptions => ({
  secret: configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
  signOptions: {
    expiresIn: expiresIn(configService, 'JWT_ACCESS_EXPIRES_IN'),
  },
});

import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationService } from './authentication.service';
import { UsersService } from '../users/users.service';
import { Repository } from 'typeorm';
import User from 'src/users/entity/users.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

describe('AuthenticationService', () => {
  const userRepository = new Repository<User>();
  const userService = new UsersService(userRepository);
  const authenticationService = new AuthenticationService(
    userService,
    new JwtService({
      secretOrPrivateKey: 'tuyen1998',
    }),
    new ConfigService(),
  );

  describe('when creating a cookie', () => {
    it('should return a string', () => {
      const userId = 1;
      expect(
        typeof authenticationService.getCookieWithJwtToken(userId),
      ).toEqual('string');
    });
  });
});

import { NestFactory } from '@nestjs/core';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { AppModule } from './core/app.module';
import { ValidationError } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors: ValidationError[]) => {
        const errorMessages = errors.map((error) => {
          return Object.values(error.constraints);
        });
        return new BadRequestException(errorMessages.toString());
      },
      forbidUnknownValues: false,
    }),
  );
  await app.listen(3000);
}
bootstrap();

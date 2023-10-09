import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '../user/entity';

@ObjectType()
export class AuthUser extends User {
  @Field((type) => String)
  token: string;
}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './database/typeormConfig';
import { Blog } from './entities/blog.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    TypeOrmModule.forFeature([Blog]),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

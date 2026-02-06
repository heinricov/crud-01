import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './database/typeormConfig';
import { Blog } from './entities/blog.entity';
import { BlogModule } from './blog/blog.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    TypeOrmModule.forFeature([Blog]),
    BlogModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

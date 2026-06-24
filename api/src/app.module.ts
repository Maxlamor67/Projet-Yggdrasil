import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {AuthModule} from "@thallesp/nestjs-better-auth";
import {auth} from "./utils/auth";
import { ProjectModule } from './project/project.module';
import {PrismaModule} from "./prisma/prisma.module";
import { UserModule } from './user/user.module';
import {MapModule} from "./map/map.module";
import { SafetyEquipmentTypeModule } from './safety-equipment-type/safety-equipment-type.module';
import {APP_GUARD} from "@nestjs/core";
import {AdminGuard} from "./utils/guards/admin.guard";

@Module({
  imports: [
    AuthModule.forRoot({
      auth
    }),
    PrismaModule,
    ProjectModule,
    UserModule,
    MapModule,
    SafetyEquipmentTypeModule,
  ],
  controllers: [AppController],
  providers: [
      AppService,
      {
        provide: APP_GUARD,
        useClass: AdminGuard,
      }
  ],
})
export class AppModule {}

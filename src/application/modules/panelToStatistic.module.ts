import { forwardRef, Module } from '@nestjs/common';
import { AccountService } from '../services/account/account.service';
import { AccountRepository } from '../services/account/repository/account.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from 'src/domains/account.entity';
import { AccountController } from 'src/controllers/account.controller';


@Module({
  imports: [
  ],
  controllers: [AccountController],
  providers: [AccountService, AccountRepository],
  exports: [AccountService],
})
export class PanelToStatisticModule {}

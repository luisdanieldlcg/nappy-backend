import { Injectable, Logger } from '@nestjs/common';
import { UserPrincipal } from '../../auth/interface/user-principal.interface';
import { CreateCardDTO } from '../dto/create-card.dto';
import { CardRepository } from '../repository/card.repository';

@Injectable()
export class CardService {
  private readonly logger = new Logger(CardService.name);
  constructor(private readonly cardRepository: CardRepository) {}

  public create(dto: CreateCardDTO, user: UserPrincipal) {
    console.log({ dto });
    return this.cardRepository.create({
      ...dto,
      createdBy: user.id,
    });
  }
  public getCardsByUser(user: UserPrincipal) {
    return this.cardRepository.findByUser(user);
  }
}

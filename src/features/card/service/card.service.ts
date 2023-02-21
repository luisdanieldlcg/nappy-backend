import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { EMPTY, mergeMap, of, throwIfEmpty } from 'rxjs';
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

  public getCardByUser(user: UserPrincipal) {
    return this.cardRepository.findByUser(user);
  }
  public delete(id: string) {
    return this.cardRepository.deleteById(id).pipe(
      mergeMap((p) => (p ? of(p) : EMPTY)),
      throwIfEmpty(() => new NotFoundException(`Card: ${id} was not found`)),
    );
  }
}

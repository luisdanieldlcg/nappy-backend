import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { join } from 'path';
import { EMPTY, mergeMap, Observable, of, switchMap, throwIfEmpty } from 'rxjs';
import {
  ImageFormatMismatchException,
  InvalidImageFormatException,
} from '../../../common/exceptions/image-upload.exceptions';
import {
  fileMatchesExtension,
  removeFile,
} from '../../../common/helpers/image-upload';
import { UserPrincipal } from '../../auth/interface/user-principal.interface';
import { CardDTO, CreateCardDTO } from '../dto/card.dto';
import { CardRepository } from '../repository/card.repository';

@Injectable()
export class CardService {
  private readonly logger = new Logger(CardService.name);
  constructor(private readonly cardRepository: CardRepository) {}

  public create(dto: CreateCardDTO, user: UserPrincipal) {
    return this.cardRepository.create({
      firstName: dto.firstName || user.email.split('@')[0] || '',
      createdBy: user.id,
      ...dto,
    });
  }

  public getCardsByUser(user: UserPrincipal) {
    return this.cardRepository.findByUser(user);
  }

  public updateCard(id: string, dto: CardDTO, user: UserPrincipal) {
    return this.cardRepository.updateById(id, dto, user);
  }

  public validateImage(
    dto: CreateCardDTO,
    file?: Express.Multer.File,
  ): Observable<CreateCardDTO> {
    if (file) {
      if (!file.filename) throw new InvalidImageFormatException();
      dto.coverImage = file.filename;
      const imagesPath = join(process.cwd(), 'public/images');
      const fullPath = imagesPath + '/' + file.filename;
      return fileMatchesExtension(fullPath).pipe(
        switchMap((isLegit) => {
          if (!isLegit) {
            removeFile(fullPath);
            throw new ImageFormatMismatchException();
          }
          return of(dto);
        }),
      );
    }
    // No need to modify DTO
    return of(dto);
  }

  public assertCardBelongsTo(cardId: string, user: UserPrincipal) {
    return this.cardRepository
      .findOne({ _id: cardId, createdBy: user.id })
      .pipe(
        mergeMap((p) => (p ? of(p) : EMPTY)),
        throwIfEmpty(
          () => new NotFoundException(`Card: ${cardId} was not found`),
        ),
      );
  }

  public delete(id: string) {
    return this.cardRepository.deleteById(id).pipe(
      mergeMap((p) => (p ? of(p) : EMPTY)),
      throwIfEmpty(() => new NotFoundException(`Card: ${id} was not found`)),
    );
  }
}

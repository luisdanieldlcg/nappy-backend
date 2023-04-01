import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { join } from 'path';
import {
  catchError,
  EMPTY,
  forkJoin,
  from,
  map,
  mergeMap,
  Observable,
  of,
  switchMap,
  tap,
  throwIfEmpty,
} from 'rxjs';
import {
  ImageFormatMismatchException,
  InvalidImageFormatException,
} from '../../../common/exceptions/app.exceptions';
import {
  fileMatchesExtension,
  removeFile,
} from '../../../common/helpers/image-upload';
import { UploadedCardImages } from '../../../common/types';
import { UserPrincipal } from '../../auth/interface/user-principal.interface';
import { CardDTO, CreateCardDTO } from '../dto/card.dto';
import { CardRepository } from '../repository/card.repository';

const IMAGE_URL_PREFIX = 'http://localhost:3001/images/';

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

  public getCardsByUser(userId: string) {
    return this.cardRepository.findByUser(userId).pipe(
      tap((cards) => {
        cards.forEach((card) => {
          if (card.avatarImage) {
            card.avatarImage = IMAGE_URL_PREFIX + card.avatarImage;
          }
          if (card.coverImage) {
            card.coverImage = IMAGE_URL_PREFIX + card.coverImage;
          }
        });
      }),
    );
  }

  public getCardById(id: string) {
    return this.cardRepository.findById(id).pipe(
      throwIfEmpty(() => new NotFoundException('Card not found')),
      tap((card) => {
        if (card.avatarImage) {
          card.avatarImage = IMAGE_URL_PREFIX + card.avatarImage;
        }
        if (card.coverImage) {
          card.coverImage = IMAGE_URL_PREFIX + card.coverImage;
        }
      }),
    );
  }

  public updateCard(id: string, dto: CardDTO, user: UserPrincipal) {
    return this.cardRepository.updateById(id, dto, user);
  }

  private validateImageContent(file?: Express.Multer.File) {
    if (!file.filename) {
      throw new InvalidImageFormatException();
    }
    const imagesPath = join(process.cwd(), 'public/images');
    const fullPath = imagesPath + '/' + file.filename;
    return fileMatchesExtension(fullPath).pipe(
      switchMap((isLegit) => {
        if (!isLegit) {
          removeFile(fullPath);
          throw new ImageFormatMismatchException();
        }
        return of(true);
      }),
    );
  }
  public validateImages(
    dto: CreateCardDTO,
    images: UploadedCardImages,
  ): Observable<CreateCardDTO> {
    if (!images) {
      return of(dto);
    }
    if (!images.coverImage && !images.avatarImage) {
      return of(dto);
    }
    const observables: Observable<boolean>[] = [];

    if (images.coverImage) {
      const coverImage = images.coverImage[0];
      const coverObservable = this.validateImageContent(coverImage).pipe(
        tap((valid) => (valid ? (dto.coverImage = coverImage.filename) : null)),
      );
      observables.push(coverObservable);
    }
    if (images.avatarImage) {
      const avatarImage = images.avatarImage[0];
      const avatarObservable = this.validateImageContent(avatarImage).pipe(
        tap((valid) =>
          valid ? (dto.avatarImage = avatarImage.filename) : null,
        ),
      );
      observables.push(avatarObservable);
    }

    return forkJoin(observables).pipe(map(() => dto));
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
      throwIfEmpty(() => new NotFoundException(`Card ${id} was not found`)),
      tap((card) => {
        if (card.avatarImage) {
          this.deleteImage(card.avatarImage);
        }
        if (card.coverImage) {
          this.deleteImage(card.coverImage);
        }
      }),
    );
  }

  public deleteAll(user: UserPrincipal) {
    const cards = this.getCardsByUser(user.id).pipe(
      tap((cards) => {
        cards.forEach((entry) => {
          if (entry.avatarImage) {
            this.deleteImage(entry.avatarImage);
          }
          if (entry.coverImage) {
            this.deleteImage(entry.coverImage);
          }
        });
      }),
    );
    return cards.pipe(
      mergeMap((_) => {
        return this.cardRepository
          .deleteAll(user)
          .pipe(tap((e) => console.log(e)));
      }),
    );
  }

  public deleteImage(path: string) {
    const imagesPath = join(process.cwd(), 'public/images');
    const fullPath = imagesPath + '/' + path;
    return removeFile(fullPath);
  }
}

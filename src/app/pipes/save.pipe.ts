import { Pipe, PipeTransform } from '@angular/core';

import { ImageService } from '../image.service';

import { ImageFile } from '../interfaces';

@Pipe({ name: 'save' })
export class SavePipe implements PipeTransform {

  constructor(
    private imageService: ImageService
  ) { }

  transform(images: ImageFile[]): ImageFile[] {
    // console.log(images);
    this.imageService.images = images;
    return images;
  }

}

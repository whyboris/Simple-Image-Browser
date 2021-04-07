import { Pipe, PipeTransform } from '@angular/core';
import { ImageFile } from '../home/home.component';

import { ImageService } from '../image.service';

@Pipe({
  name: 'save'
})
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

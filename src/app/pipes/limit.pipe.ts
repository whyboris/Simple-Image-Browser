import { Pipe, PipeTransform } from '@angular/core';

import { ImageFile } from '../interfaces';

@Pipe({ name: 'limit' })
export class LimitPipe implements PipeTransform {

  transform(images: ImageFile[]): ImageFile[] {
    // console.log(images);
    return images.slice(0, 20);
  }

}

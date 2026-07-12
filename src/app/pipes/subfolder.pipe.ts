import { Pipe, PipeTransform } from '@angular/core';
import { ImageFile } from '../home/home.component';

@Pipe({ name: 'subfolder' })
export class SubfolderPipe implements PipeTransform {

  transform(images: ImageFile[], subfolder: string): ImageFile[] {

    console.log('subfolder pipe disabled');

    return images;

    return images.filter((image: ImageFile) => {
      return image.partialPath === subfolder;
    });
  }

}

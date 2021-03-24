import { Pipe, PipeTransform } from '@angular/core';
import { ImageFile } from '../home/home.component';

@Pipe({
  name: 'subfolder'
})
export class SubfolderPipe implements PipeTransform {

  transform(images: ImageFile[], subfolder: string): ImageFile[] {
    return images.filter((image: ImageFile) => {
      return image.partialPath === subfolder;
    });
  }

}

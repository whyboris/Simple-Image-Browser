import { Pipe, PipeTransform } from '@angular/core';
import { ImageFile } from '../home/home.component';

@Pipe({
  name: 'filetype'
})
export class FiletypePipe implements PipeTransform {

  transform(images: ImageFile[], showPng: boolean, showJpg: boolean, showJxl: boolean, showGif: boolean): ImageFile[] {
    return images.filter((image: ImageFile) => {
      switch(image.extension) {
        case 'jpg':
          return showJpg;
        case 'jpeg':
          return showJpg;
        case 'jxl':
          return showJxl;
        case 'png':
          return showPng;
        case 'gif':
          return showGif;
      }
    });
  }

}

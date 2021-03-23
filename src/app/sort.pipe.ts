import { Pipe, PipeTransform } from '@angular/core';
import { ImageFile } from './home/home.component';

@Pipe({
  name: 'sort'
})
export class SortPipe implements PipeTransform {

  transform(images: ImageFile[]): ImageFile[] {
    console.log(images);
    return images.sort((a, b) => a.name.localeCompare(b.name, undefined, {sensitivity: 'base'}));
  }

}

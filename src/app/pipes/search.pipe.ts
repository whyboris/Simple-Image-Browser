import { Pipe, PipeTransform } from '@angular/core';
import { ImageFile } from '../home/home.component';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(images: ImageFile[], searchString: string): ImageFile[] {

    console.log(searchString);

    if (searchString === '') {
      return images;
    } else {
      return images.filter((image) => {
        return image.name.includes(searchString);
      });
    }

  }

}

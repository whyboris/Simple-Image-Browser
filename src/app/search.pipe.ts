import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(images: any[], searchString: string): unknown {

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

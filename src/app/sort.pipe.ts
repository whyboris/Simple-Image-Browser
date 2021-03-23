import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sort'
})
export class SortPipe implements PipeTransform {

  transform(images: any[]): any[] {
    console.log(images);
    return images.sort((a, b) => a.name.localeCompare(b.name, undefined, {sensitivity: 'base'}));
  }

}

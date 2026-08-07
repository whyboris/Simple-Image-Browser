import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'dir' })
export class DirPipe implements PipeTransform {

  transform(path: any): any {

    const depth = path.split('/').length - 1;



    return "_".repeat(depth) + path.substring(path.lastIndexOf('/') + 1);
  }

}

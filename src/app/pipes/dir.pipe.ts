import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'dir' })
export class DirPipe implements PipeTransform {

  transform(path: any): any {
    return path.substring(path.lastIndexOf('/') + 1);
  }

}

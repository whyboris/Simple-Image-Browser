import { Injectable } from '@angular/core';
import { ImageFile } from './home/home.component';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  images: ImageFile[] = [];

  constructor() {}
}

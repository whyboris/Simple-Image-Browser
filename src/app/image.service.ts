import { Injectable } from '@angular/core';
import { ImageFile } from './interfaces';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  images: ImageFile[] = [];

  constructor() {}
}

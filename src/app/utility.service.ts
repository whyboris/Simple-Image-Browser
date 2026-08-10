import { Injectable } from '@angular/core';
import { ImageFile, myTree } from './interfaces';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  processData(data: ImageFile[], inputFolder: string): myTree[] {

    const mapOfEverything: Map<string, string[]> = new Map();

    data.forEach(element => {
      if (mapOfEverything.has(element.partialPath)) {
        mapOfEverything.get(element.partialPath).push(element.fullPath);
      } else {
        mapOfEverything.set(element.partialPath, [element.fullPath]);
      }
    });

    let paths = Array.from(mapOfEverything.keys());

    const onlyFolders = paths.map((el) => el.substring(0, el.lastIndexOf("/")));

    const uniqueFoldersSet = new Set(onlyFolders);

    const allFolders = new Set();

    // backfill folders that have no images in them but have subfolders with images
    uniqueFoldersSet.forEach((element: string) => {
      const parentPaths = this.getAllParentPaths(element);

      parentPaths.forEach((parent) => allFolders.add(parent));

      allFolders.add(element);
    });

    const backfilled = [...allFolders];

    const sorted = this.naturalSort(backfilled);

    const root = inputFolder.replace(/\\/g, '/');

    // add the root node
    const dirData: myTree[] = [{
      path: root.slice(root.lastIndexOf('/') + 1),
      display: true,
      depth: 0,
      expanded: true,
      hasChildren: true,
      selected: true,
      total: 0,
    }];

    sorted.forEach((path) => {

      const depth = path.split('/').length - 1;

      if (path !== '') {
        dirData.push({
          path: path,
          selected: false,
          expanded: false,
          hasChildren: sorted.some((elPath) => elPath !== path && elPath.includes(path + '/')),
          depth: depth,
          display: depth > 1 ? false : true,
          total: data.filter((file) => file.folderPath === path + '/').length,
        })
      }
    });

    return dirData;
  }


  getAllParentPaths(folderPath: string): string[] {
    const segments = folderPath.split('/').filter(Boolean);
    const paths = [];

    // Build the path incrementally up to the parent level
    for (let i = 1; i < segments.length; i++) {
      const parentPath = segments.slice(0, i).join('/');
      paths.push(folderPath.startsWith('/') ? `/${parentPath}` : parentPath);
    }

    return paths;
  }

  naturalSort(array: any[]): any[] {
    array.sort((a, b) =>
      a.localeCompare(b, navigator.languages[0] || navigator.language, {
        numeric: true,
        ignorePunctuation: true,
      })
    );

    return array;
  }


}

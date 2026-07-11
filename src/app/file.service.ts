import { Injectable } from '@angular/core';

import { platform } from '@tauri-apps/plugin-os';

export interface ParsedPath {
    base: string;
    dir: string;
    ext: string;
    name: string;
    root: string;
}

@Injectable({
  providedIn: 'root'
})
export class FileService {

  readonly tempTextFilename = 'simplest-file-renamer-scratchpad.txt';

  isWindows: boolean;
  sep: "\\" | "/";

  constructor() {
    this.isWindows = platform() === 'windows' ? true : false;
    this.sep = this.isWindows ? "\\" : "/";
  }

  parse(path: string): ParsedPath {
    if (this.isWindows) {
      return this.parseWin(path);
    } else {
      return this.parsePosix(path);
    }
  }

  // Below comes from the `path-parse` NPM package
  // https://github.com/jbgutierrez/path-parse/blob/master/index.js

  // WINDOWS SECTION =========================================================================================

  splitWindowsRe =
    /^(((?:[a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/]+[^\\\/]+)?[\\\/]?)(?:[^\\\/]*[\\\/])*)((\.{1,2}|[^\\\/]+?|)(\.[^.\/\\]*|))[\\\/]*$/;

  win32SplitPath(filename: string) {
    return this.splitWindowsRe.exec(filename).slice(1);
  }

  parseWin(pathString: string): ParsedPath {
    if (typeof pathString !== 'string') {
      throw new TypeError(
          "Parameter 'pathString' must be a string, not " + typeof pathString
      );
    }
    var allParts = this.win32SplitPath(pathString);
    if (!allParts || allParts.length !== 5) {
      throw new TypeError("Invalid path '" + pathString + "'");
    }
    return {
      root: allParts[1],
      dir: allParts[0] === allParts[1] ? allParts[0] : allParts[0].slice(0, -1),
      base: allParts[2],
      ext: allParts[4],
      name: allParts[3]
    };
  };


  // POSIX SECTION =========================================================================================

  splitPathRe =
    /^((\/?)(?:[^\/]*\/)*)((\.{1,2}|[^\/]+?|)(\.[^.\/]*|))[\/]*$/;

  posixSplitPath(filename: string) {
    return this.splitPathRe.exec(filename).slice(1);
  }

  parsePosix(pathString: string): ParsedPath {
    if (typeof pathString !== 'string') {
      throw new TypeError(
          "Parameter 'pathString' must be a string, not " + typeof pathString
      );
    }
    var allParts = this.posixSplitPath(pathString);
    if (!allParts || allParts.length !== 5) {
      throw new TypeError("Invalid path '" + pathString + "'");
    }

    return {
      root: allParts[1],
      dir: allParts[0].slice(0, -1),
      base: allParts[2],
      ext: allParts[4],
      name: allParts[3],
    };
  };


}

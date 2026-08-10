import { Component, effect, input, Input, output, signal } from "@angular/core";
import { DirPipe } from "../pipes/dir.pipe";
import { myTree } from "../interfaces";
import { DecimalPipe } from "@angular/common";

@Component({
    selector: 'dir-view',
    imports: [ DirPipe, DecimalPipe ],
    templateUrl: 'dir.component.html',
    styleUrl: './dir.component.scss'
})
export class DirViewComponent {

  @Input() public pathList: myTree[];
  showSizes = input();
  expandTreeToggle = input(false);

  messageEvent = output<string>();

  constructor() {
    effect(() => {
      this.expandTree(this.expandTreeToggle());
    });
  }

  clicked(data: any) {
    this.pathList.forEach(element => element.selected = false);

    console.log(data);
    data.selected = !data.selected;

    if (data.depth !== 0) {
      this.messageEvent.emit(data);
    } else {
      const clone = JSON.parse(JSON.stringify(data));
      clone.path = '/';
      this.messageEvent.emit(clone);
    }
  }

  expandTree(change: boolean): void {
    this.pathList.forEach((element) => {
      if (change === false && element.depth <= 1) {
        // do nothing -- do not hide the 1st level folders
      } else {
        element.display = change;
      }
    });
  }

  expand(data: any): void {
    console.log(data);

    // data.expanded = !data.expanded;
    const change = !data.expanded;

    this.pathList.forEach((element) => {
      if (element.path !== data.path && element.path.startsWith(data.path + '/') && element.depth == data.depth + 1) {
        element.display = change;
      }
    });

    data.expanded = change;

  }

}

import { Component, Input, output, signal } from "@angular/core";
import { DirPipe } from "../pipes/dir.pipe";

interface myTree {
  depth: number;
  expanded: boolean;
  hasChildren: boolean;
  path: string;
  selected: boolean;
  display: boolean;
}


@Component({
    selector: 'dir-view',
    imports: [ DirPipe ],
    templateUrl: 'dir.component.html',
    styleUrl: './dir.component.scss'
})
export class DirViewComponent {

  @Input() public pathList: myTree[];

  messageEvent = output<string>();

  clicked(data: any) {
    this.pathList.forEach(element => element.selected = false);

    console.log(data);
    data.selected = !data.selected;

    this.messageEvent.emit(data);
  }

  expand(data: any) {
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

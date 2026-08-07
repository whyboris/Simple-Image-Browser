import { Component, Input, output, signal } from "@angular/core";
import { FormsModule } from '@angular/forms';

import type { MyTreeNode } from "../interfaces";

@Component({
    selector: 'tree-view',
    imports: [ FormsModule ],
    templateUrl: 'tree.component.html',
    styleUrl: './tree.component.scss'
})
export class TreeViewComponent {
  @Input() public tree: MyTreeNode[];

  selected = signal<boolean>(false);

  messageEvent = output<string>();

  folderClicked(data: any) {
    console.log('hi');
    this.selected.set(true);
    this.sendMessage(data);
  }

  sendMessage(data: any) {
    console.log(data);
    this.messageEvent.emit(data);
  }
}

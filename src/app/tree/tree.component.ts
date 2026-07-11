import { Component, Input } from "@angular/core";
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
}

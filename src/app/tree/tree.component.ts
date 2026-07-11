import { Component, Input } from "@angular/core";
import { FormsModule } from '@angular/forms';

export class TreeData {
    answer: string;
    child: TreeData[];

    constructor(answer: string, child: TreeData[]) {
        this.answer = answer;
        this.child = child;
    }
}

@Component({
    selector: 'tree-view',
    imports: [ FormsModule ],
    templateUrl: 'tree.component.html',
    styleUrl: './tree.component.scss'
})
export class TreeViewComponent {
    @Input() public tree: TreeData[];
    public newAnswers: Array<string> = [];

    public add(answer: string, node: TreeData) {
        node.child.push({answer, child: []});
    }
}

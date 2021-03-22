import { ITreeOptions, TREE_ACTIONS } from '@circlon/angular-tree-component';

export const MyTreeOptions: ITreeOptions = {
  actionMapping: {
    mouse: {
      click: (tree, node, $event) => {
        if (node.hasChildren) {
          TREE_ACTIONS.TOGGLE_EXPANDED(tree, node, $event);
        }
        console.log(node.data);
      }
    }
  },
  nodeHeight: 30,
  levelPadding: 10
}

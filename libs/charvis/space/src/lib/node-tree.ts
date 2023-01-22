export interface TreeModel<T> {
    id: string;
    parent_id?: string;
    value: T;
}

export class TreeNode<T> {

    id: string;

    value: T;
    children: TreeNode<T>[] = [];
    parent: TreeNode<T> | undefined;

    constructor(id: string, value: T) {
        this.id = id;
        this.value = value;
    }

    add(node: TreeNode<T>): void {
        node.parent = this;
        this.children.push(node);
    }

    addMany(nodes: TreeNode<T>[]): void {
        for (let node of nodes) {
            this.add(node);
        }
    }

    find(id: string): TreeNode<T> | undefined {
        if (this.id === id) {
            return this;
        }
        for (let child of this.children) {
            let found = child.find(id);
            if (found) {
                return found;
            }
        }
        return undefined;
    }

    depth(node: TreeNode<T>, counter: number = 0): number | undefined {
        if (!node.parent) {
            return counter;
        }

        const depth = node.depth(node.parent, ++counter);
        if (depth) {
            return depth;
        }

        return undefined;
    }

    toString(): string {
        return `${ this.id } - ${ this.value }`
    }
}

function createTree<T>(model: TreeModel<T>[], rootNodes: any): TreeNode<T>[] {
    const tree: TreeNode<T>[] = [];

    for (let rootNode in rootNodes) {
        const nodeData = rootNodes[rootNode];
        const treeNode = new TreeNode<T>(nodeData.id, nodeData.value)

        if (!nodeData && !rootNodes.hasOwnProperty(rootNode)) {
            continue;
        }

        const childNodes = model[nodeData.id];

        if (childNodes) {
            treeNode.addMany(createTree(
                model,
                childNodes
            ));
        }

        tree.push(treeNode);
    }

    return tree;
}

function groupByParents<T>(array: TreeModel<T>[]) {
    return array.reduce(function (prev, item) {
        let parentID = item.parent_id;

        if (!parentID) {
            parentID = '0';
        }

        if (parentID && prev.hasOwnProperty(parentID)) {
            prev[parentID].push(item);
            return prev;
        }

        prev[parentID] = [ item ];
        return prev;
    }, {} as any);
}

function isObject(o: any): o is Object {
    return Object.prototype.toString.call(o) === '[object Object]';
}

function deepClone(data: any): any {
    if (Array.isArray(data)) {
        return data.map(deepClone);
    } else if (isObject(data)) {
        return Object.keys(data).reduce(function (o: any, k: string) {
            o[k] = deepClone(data[k]);
            return o;
        }, {});
    } else {
        return data;
    }
}

/**
 * arrayToTree
 * Convert a plain array of nodes (with pointers to parent nodes) to a nested
 * data structure
 *
 * @name arrayToTree
 * @function
 *
 * @param {Array} data An array of data
 * @param {Object} options An object containing the following fields:
 *
 *  - `parentProperty` (String): A name of a property where a link to
 * a parent node could be found. Default: 'parent_id'
 *  - `customID` (String): An unique node identifier. Default: 'id'
 *  - `childrenProperty` (String): A name of a property where children nodes
 * are going to be stored. Default: 'children'.
 *
 * @return {Array} Result of transformation
 */

export function arrayToTree<T>(data: TreeModel<T>[]) {
    const treeOptions = {
        customID: 'id',
        rootID: '0'
    };

    if (!Array.isArray(data)) {
        throw new TypeError('Expected an array but got an invalid argument');
    }

    let grouped = groupByParents<T>(deepClone(data));
    return createTree(
        grouped,
        grouped[treeOptions.rootID]
    );
}
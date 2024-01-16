import { arrayToTree, TreeModel } from "./node-tree";

describe('Tree', () => {

    const nodes: TreeModel<string>[] = [
        {
            id: '1',
            value: 'Sandbox',
            parent_id: '3'
        },
        {
            id: '2',
            value: 'Production',
            parent_id: '3'
        },
        {
            id: '3',
            value: "default",
        }
    ];

    it('should create an array of trees', () => {
        const trees = arrayToTree(nodes);

        expect(trees.length).toEqual(1);
    })


    it('should create flat array without children', () => {
        const parentless = [
            {
                id: '1',
                value: 'Sandbox',
            },
            {
                id: '2',
                value: 'Production',
            },
            {
                id: '3',
                value: 'Default',
            }
        ];
        const tree = arrayToTree(parentless);

        expect(tree).toEqual([
            {
                "children": [],
                "id": "1",
                "value": "Sandbox"
            },
            {
                "children": [],
                "id": "2",
                "value": "Production"
            },
            {
                "children": [],
                "id": "3",
                "value": "Default"
            }
        ]);
    });

    it('should return node by id', () => {
        const tree = arrayToTree(nodes);

        const node = tree[0].find('2');

        expect(node).toBeTruthy();
        expect(node!.id).toEqual('2');
        expect(node!.value).toEqual('Production');
    });

    it('should return depth of root', () => {
        const tree = arrayToTree(nodes);

        const node = tree[0].find('3')!;

        expect(node.depth(node)).toEqual(0);
    });

    it('should return depth of deeply nested', () => {
        const deep: TreeModel<string>[] = [
            {
                id: '3',
                value: "root",
            },
            {
                id: '1',
                value: 'Sandbox',
                parent_id: '3'
            },
            {
                id: '2',
                value: 'Production',
                parent_id: '1'
            },
            {
                id: '4',
                value: 'Here',
                parent_id: '2'
            }
        ];
        const tree = arrayToTree(deep);

        const node = tree[0].find('4')!;

        expect(node.id).toEqual('4');
        expect(node.depth(node)).toEqual(3);
    });

    // Maximum call stack size exceeded
    // it('should handle circular trees', () => {
    //     const deep: TreeModel<string>[] = [
    //         {
    //             id: '0',
    //             value: 'root',
    //         },
    //         {
    //             id: '1',
    //             value: "root",
    //             parent_id: '4'
    //         },
    //         {
    //             id: '2',
    //             value: 'rootToo',
    //             parent_id: '1'
    //         },
    //         {
    //             id: '4',
    //             value: 'rootToo',
    //             parent_id: '2'
    //         }
    //     ];
    //     const tree = arrayToTree(deep);
    //
    //
    //     expect(tree.length).toEqual(2);
    // });

});
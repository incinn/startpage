interface Test {
    id: number;
    name: string;
}

function test(): void {
    let item: Test = { id: 1, name: 'testing' };
    console.log(item);
}

test();

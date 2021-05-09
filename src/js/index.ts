interface Test {
    id: number;
    name: string;
}

function foo(): void {
    let item: Test = { id: 1, name: 'testing' };
    console.log(item);
}

foo();

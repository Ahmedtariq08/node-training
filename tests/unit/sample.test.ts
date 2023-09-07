//ANCHOR - Sample tests
const sum = (a: number, b: number) => {
    return a + b;
}

const getCurrencies = (): string[] => {
    return ['USD', 'EUR', 'CAD']
}

const getProduct = (productId: number) => {
    return { id: productId, price: 10 }
}

const registerUser = (username: any) => {
    if (!username) {
        throw new Error('Username is required');
    }
    return { id: new Date().getTime(), username: username };
}

const input1 = 2;
const input2 = 4;
const output = 6;

describe('sample', () => {
    it('Sum should be same', () => {
        let result = sum(input1, input2);
        expect(output).toEqual(result);
    })
})

describe('getCurrencies', () => {
    it('should return supported currencies', () => {
        const result = getCurrencies();
        expect(result).toEqual(expect.arrayContaining(['USD', 'EUR', 'CAD']));
    })
})

describe('getProduct', () => {
    it('should return product with given id', () => {
        const result = getProduct(1);
        expect(result).toEqual(expect.objectContaining({ id: 1, price: 10 }));
    })
})

describe('registerUser', () => {
    it('should throw if username is falsy', () => {
        const args = [null, undefined, '', NaN, 0, false];
        args.forEach(arg => {
            expect(() => registerUser(arg)).toThrow();
        })
    });
    it('should return a user object if valid username is passed', () => {
        const result = registerUser('Ahmed Tariq');
        expect(result).toMatchObject({ username: 'Ahmed Tariq' });
        expect(result.id).toBeGreaterThan(0);
    })
})

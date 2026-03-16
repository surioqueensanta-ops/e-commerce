
function checkVariable(input) {
    switch (typeof input) {
        case 'string':
            return 'string';
        case 'number':
            return 'number';
        case 'boolean':
            return 'boolean';
        case 'bigint':
            return 'bigint';
        case 'undefined':
            return 'undefined';
        default:
            return 'object';
    }
}

console.log('=== Problem 1: Type Checker ===');
console.log(checkVariable("hello"));     
console.log(checkVariable(42));          
console.log(checkVariable(true));      
console.log(checkVariable(123n));  
console.log(checkVariable(undefined));  
console.log(checkVariable(null));     
console.log(checkVariable({}));           
console.log(checkVariable([]));           


function generateIDs(count) {
    const ids = [];
    
    for (let i = 0; i < count; i++) {
        if (i === 5) {
            continue;
        }
        ids.push(`ID-${i}`);
    }
    
    return ids;
}

console.log('\n=== Problem 2: Secure ID Generator ===');
console.log(generateIDs(7)); 
console.log(generateIDs(5));  


function calculateTotal(...numbers) {
    numbers.forEach(num => {
        if (typeof num !== 'number') {
            throw new TypeError('Invalid input: All arguments must be numbers');
        }
    });
    
    return numbers.reduce((sum, current) => sum + current, 0);
}


console.log('\n=== Problem 3: Functional Sum ===');
console.log(calculateTotal(1, 2, 3, 4, 5)); 
console.log(calculateTotal(10, 20, 30));    
console.log(calculateTotal());               

function getTopScorers(playerList) {
    return playerList
        .filter(player => player.score > 8)   
        .map(player => player.name)             
        .join(', ');                            
}


console.log('\n=== Problem 4: Leaderboard Filter ===');
const players = [
    { name: 'Alice', score: 10 },
    { name: 'Bob', score: 5 },
    { name: 'Charlie', score: 9 },
    { name: 'David', score: 7 },
    { name: 'Eve', score: 12 },
    { name: 'Frank', score: 8 },
    { name: 'Grace', score: 11 },
    { name: 'Henry', score: 6 },
    { name: 'Ivy', score: 4 },
    { name: 'Jack', score: 15 }
];

console.log(getTopScorers(players)); 


class Item {
  
    #discount = 0.1;
    
    constructor(name, price) {
        this.name = name;
        this.price = price;
    }
    
    get finalPrice() {
        return this.price - (this.price * this.#discount);
    }
    
    displayInfo() {
        console.log(`${this.name}: Original Price = ₱${this.price}, Final Price = ₱${this.finalPrice}`);
    }
}

console.log('\n=== Problem 5: Private Inventory ===');
const item1 = new Item('Laptop', 1000);
const item2 = new Item('Mouse', 50);
const item3 = new Item('Keyboard', 80);

console.log('Laptop final price:', item1.finalPrice);    
console.log('Mouse final price:', item2.finalPrice);   
console.log('Keyboard final price:', item3.finalPrice);  
item1.displayInfo();
item2.displayInfo();
item3.displayInfo();

console.log('Accessing discount directly:', item1.discount); 

function safeDivide(a, b) {
    try {
        if (b === 0) {
            throw new Error('Cannot divide by zero');
        }
        return a / b;
    } catch (error) {
        return error.message;
    } finally {
        console.log('Operation attempted');
    }
}

console.log('\n=== Problem 6: Robust Division ===');
console.log('10 / 2 =', safeDivide(10, 2)); 
console.log('10 / 0 =', safeDivide(10, 0)); 
console.log('15 / 3 =', safeDivide(15, 3)); 


console.log('\n=== Additional Test Cases ===');

console.log('P1 - Function:', checkVariable(function() {}));  
console.log('P1 - Symbol:', checkVariable(Symbol('id'))); 

console.log('P2 - Count 0:', generateIDs(0));  
console.log('P2 - Count 1:', generateIDs(1));   
console.log('P2 - Count 6:', generateIDs(6));  

console.log('P3 - Single number:', calculateTotal(42));        
console.log('P3 - Negative numbers:', calculateTotal(-5, 10));

const smallTeam = [
    { name: 'John', score: 9 },
    { name: 'Jane', score: 7 },
    { name: 'Joe', score: 10 }
];
console.log('P4 - Small team:', getTopScorers(smallTeam)); 

const item4 = new Item('Discounted Item', 20);
console.log('P5 - Discounted item:', item4.finalPrice);  
item4.displayInfo();

console.log('P6 - Negative numbers:', safeDivide(-10, 2));  
console.log('P6 - Decimal division:', safeDivide(7, 2));    
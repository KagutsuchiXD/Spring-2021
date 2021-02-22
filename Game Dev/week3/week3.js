// let circle = {
//     radius: 4,
//     get diameter(){return this.radius *2},
//     set diameter(value){this.radius = value/2}
// };

let circle = {
    radius: 4
};

Object.defineProperty(circle, 'diameter',{
    get(){return this.radius * 2},
    set(value){this.radius = value / 2},
    enumerable: true,
    configurable: true
});

console.log(circle.radius);
console.log(circle.diameter);

circle.diameter = 4;

console.log(circle.radius);
console.log(circle.diameter);
//reflection
for (let property in circle){
    console.log(property);
}


let x = true;
let y = '1';

if (x==y){
    console.log('x is equal to y');
} else{
    console.log('x is not equal to y');
}
if (x===y){
    console.log('x is equal to y');
} else{
    console.log('x is not equal to y');
}
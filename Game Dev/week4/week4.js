function demoScope(count) {
    let total = 0;

    for (let counter = 0; counter < count; counter++){
        total += counter;
    }

    if(total % 2 === 0){
        var even = true; // var makes a variable function scope instead of just in its braces
    }else {
        even = false;
    }

    if(even === true){
        console.log("The total is even: " + total);
    } else{
        console.log("The total is odd: " + total)
    }
}

demoScope(6);
demoScope(7);
demoScope(8);

//closure
function fibonacci(){
    let memory = {
        0:1,
        1:1
    };

    return function inner(n){
        if (!(n in memory)){
            memory[n] = inner(n-1) + inner(n-2);
        }
        return memory[n];
    }
}

let myFib = fibonacci();
console.log(myFib(10));
console.log(myFib(11));

myFib = null; // for cleaning memory

// also closure Immediately Executed function Expression
let myFib2 = (function (){
    let memory = {
        0:1,
        1:1
    };

    return function inner(n){
        if (!(n in memory)){
            memory[n] = inner(n-1) + inner(n-2);
        }
        return memory[n];
    }
})();

console.log(myFib2(10));
console.log(myFib2(11));

myFib2 = null; // for cleaning memory
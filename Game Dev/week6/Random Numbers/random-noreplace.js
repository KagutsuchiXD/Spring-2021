// ------------------------------------------------------------------
//
// Demonstration of allowing a custom distribution of random numbers
// to be generated.
//
// ------------------------------------------------------------------
let Random = (function() {
    let bagOfNumbers = [];
    let source = [];

    // Reference: https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
    function shuffle(a) {
        source = a.slice(); // Clever trick to copy an array
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }

        return a;
    }

    function setDistribution(dist) {
        source.length = [];
        for (let i = 0; i < dist.length; i++) {
            for (number in dist[i]) {
                for (let count = 1; count <= dist[i][number]; count++) {
                    source.push(number);
                }
            }
        }

        bagOfNumbers = shuffle(source);
    }

    function next() {
        if (bagOfNumbers.length === 0) {
            bagOfNumbers = shuffle(source);
        }
        return bagOfNumbers.pop();
    }

    return {
        setDistribution: setDistribution,
        next: next
    };
}());

Random.setDistribution([{1: 2}, {2: 3}, {3: 4}, {4: 5}]);

for (let i = 1; i <= 14; i++) {
    console.log(Random.next());
}

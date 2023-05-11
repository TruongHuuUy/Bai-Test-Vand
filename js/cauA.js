function groupBy(arr, n) {
    var group = [];
    
    arr.sort(function() {
        return 0.5 - Math.random();
    });

    var end = arr.length / n;

    for (var i = 0; i < end; ++i)
      group.push(arr.slice(i * n, (i + 1) * n));
    return group;
    
}

console.log(groupBy(["A", "B", "C", "D", "E", "F", "G", "H"], 3));

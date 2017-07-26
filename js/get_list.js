alert("howdy")
localforage.iterate(function(value, key, iterationNumber) {
    // Resulting key/value pair -- this callback
    // will be executed for every item in the
    // database.
    console.log([key, value]);
}).then(function() {
    console.log('Iteration has completed');
}).catch(function(err) {
    // This code runs if there were any errors
    console.log(err);
});

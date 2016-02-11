/**
 * Created by rodik on 2/11/16.
 */
"use strict";
var fs = require('fs');


function readFile(inputFile) {
    return new Promise(function(resolve, reject) {
        fs.readFile(inputFile, 'utf8', function (err, data) {
            resolve(data);
        });
    });
}

function run(inputFile) {
    readFile(inputFile).then(function(data) {
        var lengths = data.slice(0,data.indexOf('\n')).split(' ');
        var input = data.slice(data.indexOf('\n')+1).split("\n").map(function(x){return x.split("");});
    });
}
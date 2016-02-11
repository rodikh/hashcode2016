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

function linesToInt (lines) {
    return lines.map(function (line) {
       return splitLine(line);
    });
}
function splitLine (str) {
    return str.split(' ').map(function (x) {return parseInt(x);});
}

function getConfigs(lines) {
    var rt = {
        rows: lines[0][0],
        cols: lines[0][1],
        drones: lines[0][2],
        deadline: lines[0][3],
        maxPayload: lines[0][4],
        products: lines[2]
    };
    return rt;
}
function getWarehouses(lines) {
    var warehouses = [];
    var numOfWarehouses = lines[3][0];
    for (var i = 0; i<numOfWarehouses; i++) {
        var loc = lines[4+(i*2)];
        var inventory = lines[5+(i*2)];
        warehouses[i] =  {
            r: loc[0],
            c: loc[1],
            inventory: inventory
        };
    }
    return warehouses;
}
function getOrders(lines, start, productTypesLength) {
    var numOfOrders = lines[start];
    var orders = [];
    for (var i = 0; i<numOfOrders; i++) {
        var loc = lines[(start+1)+(i*2)];
        var itemsArr = [];
        var items = lines[5+(i*2)];

    }

    return orders;
}
function run(inputFile) {
    readFile(inputFile).then(function(data) {
        var lines = linesToInt(data.split('\n'));
        var configs = getConfigs(lines);
        console.log('lines', lines);
        //console.log('configs', configs);
        var warehouses = getWarehouses(lines);
        var orderStartLine = 4+(warehouses.length*2);
        var orders = getOrders(lines, orderStartLine, configs.products.length);

        var input = data.slice(data.indexOf('\n')+1).split("\n").map(function(x){return x.split("");});
    });
}

run('./data/example.in');
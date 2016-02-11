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
};

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
            id: i,
            inventory: inventory
        };
    }
    return warehouses;
}
function getOrders(lines, start) {
    var numOfOrders = lines[start];
    var orders = [];
    for (var i = 0; i<numOfOrders; i++) {
        var loc = lines[(start+1)+(i*3)];
        var itemsArr = lines[(start+3)+(i*3)];
        var items = [];
        for (var j = 0; j<itemsArr.length;j++) {
            if (!items[itemsArr[j]]) {
                items[itemsArr[j]] = 0;
            }
            items[itemsArr[j]]++;
        }
        orders.push({
            r: loc[0],
            c: loc[1],
            id: i,
            items: items
        });
    }

    return orders;
}

function createGrid(sim) {
    var grid = new Array(sim.configs.rows),
        i;
    for(i=0;i<grid.length;i++) {
        grid[i] = new Array(sim.configs.cols).fill(0);
    }
    for(i=0;i<sim.warehouses.length;i++) {
        grid[sim.warehouses[i].r][sim.warehouses[i].c] = 'W';
    }

    for (i=0;i<sim.orders.length;i++) {
        if(grid[sim.orders[i].r][sim.orders[i].c] !== 'W'){
            grid[sim.orders[i].r][sim.orders[i].c]++;
        }
    }
    return grid;
}

module.exports = {
    parseFile: function (file) {
        return readFile('./data/'+file+'.in').then(function(data) {
            var lines = linesToInt(data.split('\n'));
            var configs = getConfigs(lines);
            var warehouses = getWarehouses(lines);
            var orderStartLine = 4+(warehouses.length*2);
            var orders = getOrders(lines, orderStartLine, configs.products.length);
            var sim = {
                configs: configs,
                warehouses: warehouses,
                orders: orders,
                drones: new Array(configs.drones).fill({inventory: []}),
                nextVacantDrone: 0
            };
            sim.grid = createGrid(sim);
            return sim;
        });
    }
};
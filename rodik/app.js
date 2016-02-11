/**
 * Created by rodik on 2/11/16.
 */
"use strict";
var parser = require('./parser');
var fs = require('fs');

function run(inputFile) {
    parser.parseFile(inputFile).then(function(sim) {
        //print(sim);
        //console.log('configs', sim.configs);
        var commands = work(sim);
        console.log('commands', commands.length);
        fs.writeFile("./out/"+inputFile+".out", commands.join('\n'), function(err) {
            if(err) {
                return console.log(err);
            }
            console.log("The file was saved!");
        });
    }).catch(function(err){
        console.error(err);
    });
}



function print(sim) {
    console.log('--------------');
    sim.grid.map(function(line){
        console.log(line.join(' '));
    });
    console.log('--------------');
}
run('busy_day');
run('mother_of_all_warehouses');
run('redundancy');
function dist (a,b) {
    return Math.ceil(Math.sqrt( (a.r- b.r)*(a.r- b.r) + (a.c- b.c)*(a.c- b.c) ));
}
function order_findClosestProductWarehouse(order, product, sim) {
    var minDist = Infinity, i, closestId = -1;
    var validWarehouses = [];
    for (i=0; i<sim.warehouses.length;i++) {
        if (sim.warehouses[i].inventory[product] >= order.items[product]) {
            validWarehouses.push(sim.warehouses[i]);
        }
    }
    for (i=0; i<validWarehouses.length;i++) {
        var tmpDist =dist(order, validWarehouses[i]);
        if (tmpDist<minDist) {
            minDist = tmpDist;
            closestId = validWarehouses[i].id;
        }
    }
    sim.warehouses[closestId].inventory[product]-= order.items[product];
    return {warehouseId: closestId, dist: minDist};
}

function sortOrders(sim) {
    var sortedOrders = JSON.parse(JSON.stringify(sim.orders));
    sortedOrders.sort(function (a, b) {
        var aCount = 0;
        var bCount = 0;
        var aItems = a.items.reduce(function (previousValue, currentValue, currentIndex, array) {
            if (currentValue) {
                aCount += parseInt(currentValue);
            }
            return previousValue + (currentValue > 0) ? 1 : 0;
        }, 0);
        var bItems = b.items.reduce(function (previousValue, currentValue, currentIndex, array) {
            if (currentValue) {
                bCount += parseInt(currentValue);
            }
            return previousValue + (currentValue > 0) ? 1 : 0;
        }, 0);
        //console.log('aItems', aItems, aCount);
        //console.log('bItems', bItems, bCount);
        return bItems - aItems || bCount - aCount;
        //todo fix sorting
    });
    return sortedOrders;
}
function work(sim) {
    var i, j;
    for (i=0; i<sim.orders.length;i++) {
        var order = sim.orders[i];
        order.closestWarehouse = [];
        for (j=0;j<order.items.length;j++) {
            if (order.items[j]) {
                order.closestWarehouse[j] = order_findClosestProductWarehouse(order, j, sim);
            }
        }
        //console.log('orderClosest', order.closestWarehouse);
    }

    var sortedOrders = sortOrders(sim);
    var commands = [];
    console.log('sorrt', sortedOrders.length);
    for (i=0;i<sortedOrders.length;i++) {
        commands = commands.concat(handleOrder(sim, sortedOrders[i]));
    }
    commands.unshift(commands.length);
    return commands;
}

function handleOrder(sim, order) {
    var commands = [], i,j;
    for (i=0;i<order.items.length;i++) {
        if (!order.items[i]) {
            continue;
        }
        var itemWeight = sim.configs.products[i];
        var itemCount = order.items[i];
        var maxAmount =  Math.floor(sim.configs.maxPayload/itemWeight);
        while (itemCount>0) {
            var amount = itemCount;
            if (itemCount > maxAmount) {
                amount = maxAmount;
            }

            commands.push([sim.nextVacantDrone, 'L', order.closestWarehouse[i].warehouseId, i, amount].join(' '));
            commands.push([sim.nextVacantDrone, 'D', order.id, i, amount].join(' '));
            sim.nextVacantDrone++;
            if (sim.nextVacantDrone >= sim.configs.drones) {
                sim.nextVacantDrone = 0;
            }
            itemCount -= amount;
        }
    }
    return commands;
}

function handleProductDelivery(sim) {
    //var i;
    //for (i=0;i<sim.warehouses.length) {
    //
    //}
}
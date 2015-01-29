const mongoose = require('mongoose');
var Promise = require("bluebird");
var controller = require('../api/modules/waypoints/controller');
var Waypoint = require('../api/modules/waypoints/schema');

var createWaypoint = Promise.promisify(Waypoint.create, Waypoint);

exports.seedWaypointsDB = function() {
    return waypointsData.findWaypoints({}).then(function(collection) {
      if(collection.length === 0) {
          console.log('seeding waypoints');
          return Promise.map(seedWaypoints, function(waypoint) {
              return createWaypoint(waypoint);
          });
      }
        else {
          console.log('no seeding executed');
          return collection.length;
        }

    });
};


var seedWaypoints = [
        {
            curator: "Marijn",
            title: "Creating an unacademic API",
            version: "1.0.0"

        },
      {
          curator: "Marijn",
          title: "How to avoid Christmas by Programming",
          version: "1.0.0"

      },
      {
          curator: "Marijn",
          title: "Assessing the food situation in the fridge",
          version: "1.0.0"

      },
        {
            title: "Async",
            curator: "yeehaa",
            version: "1.0.0",
            summary: "A good way to explain asynchronicity is to take examples from everyday life",
            description: "Asynchronicity sounds like a difficult term, but it simply is an indication of action and time. Asynchronous events do not necessarily occur at the same time. They might have to wait or listen for other events to happen. To understand what asynchronicity exactly is, it is probably better to look at examples from everyday life. As a matter of fact, real life is full of asynchronous events."
        },
        {
            title: "Composition",
            curator: "yeehaa",
            version: "1.0.0",
            summary: "Composition is a method to structure your code for optimal code reuse",
            description: "Composition is a method programmers use to design their code. Code can be a hotchpotch of meaningless words and numbers. When we think of maintainability, scalability and collaboration. You might want to structure your code in a more efficient way. Composition is one of these methods to provide us with a solution to optimize functionality reuse. It builds on the ideas of Object-Oriented-programming or simply OOP. In this lesson you will familiarise yourself with these fundamentals of structuring and designing code."
        }
];

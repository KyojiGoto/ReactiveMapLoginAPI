var FoodBank = require("../../app/models/FoodBank");
const validator = require("express-validator");
var async = require("async");

var province_lst = [
  ["Alberta", "AB"],
  ["British Columbia", "BC"],
  ["Manitoba", "MB"],
  ["New Brunswick", "NB"],
  ["Newfoundland and Labrador", "NL"],
  ["Northwest Territories", "NT"],
  ["Nova Scotia", "NS"],
  ["Nunavut", "NU"],
  ["Ontario", "ON"],
  ["Prince Edward Island", "PE"],
  ["Quebec", "QC"],
  ["Saskatchewan", "SK"],
  ["Yukon", "YT"]
];

function bounds(food_bank_list, callback) {
  var city_list = [];
  var bounds = [];
  var north = null;
  var south = null;
  var east = null;
  var west = null;
  food_bank_list.forEach(function(foodBank) {
    if (!city_list.includes(foodBank.properties.city)) {
      city_list.push(foodBank.properties.city);
    }
    if (north == null || north < foodBank.geometry.coordinates[0]) {
      north = foodBank.geometry.coordinates[0];
    }
    if (south == null || south > foodBank.geometry.coordinates[0]) {
      south = foodBank.geometry.coordinates[0];
    }
    if (east == null || east < foodBank.geometry.coordinates[1]) {
      east = foodBank.geometry.coordinates[1];
    }
    if (west == null || west > foodBank.geometry.coordinates[1]) {
      west = foodBank.geometry.coordinates[1];
    }
  });
  if (north !== null && south !== null && east !== null && west !== null) {
    bounds.push([west, north]);
    bounds.push([east, south]);
  }
  callback(null, [food_bank_list, city_list, bounds]);
}

function search(filter) {
  var search = [];
  for (var i = 0; i < filter.length; i++) {
    if (filter.charAt(i) === "l") {
      search.push({ "properties.status": "Low" });
    } else if (filter.charAt(i) === "m") {
      search.push({ "properties.status": "Medium" });
    } else if (filter.charAt(i) === "h") {
      search.push({ "properties.status": "High" });
    } else if (filter.charAt(i) === "u") {
      search.push({ "properties.status": "Undefined" });
    }
  }
  return search;
}

exports.FoodBank_default = function(req, res, next) {
  async.waterfall(
    [
      function(callback) {
        FoodBank.find({}, { _id: 0 }).exec(function(err, list_foodBanks) {
          if (err) {
            return next(err);
          }
          callback(null, list_foodBanks);
        });
      },
      function(food_bank_list, callback) {
        bounds(food_bank_list, callback);
      }
    ],
    function(err, results) {
      if (err) {
        return next(err);
      }
      // Successful, so render.
      res.send({
        title: "Food Bank List",
        FoodBank_list: results[0],
        province_lst: province_lst,
        city_list: results[1],
        bounds: results[2]
      });
    }
  );
};

exports.FoodBank_list = function(req, res, next) {
  async.waterfall(
    [
      function(callback) {
        FoodBank.find({}, { _id: 0 }).exec(function(err, list_foodBanks) {
          if (err) {
            return next(err);
          }
          callback(null, list_foodBanks);
        });
      },
      function(food_bank_list, callback) {
        bounds(food_bank_list, callback);
      }
    ],
    function(err, results) {
      if (err) {
        return next(err);
      }
      // Successful, so render.
      res.send({
        title: "Food Bank List",
        FoodBank_list: null,
        province_lst: province_lst,
        city_list: results[1],
        bounds: results[2]
      });
    }
  );
};

exports.FoodBank_list_status = function(req, res, next) {
  async.waterfall(
    [
      function(callback) {
        var search = [];
        if (req.params.status !== "ulmh") {
          search = search(req.params.status);
          FoodBank.find({ $or: search }, { _id: 0 }).exec(function(
            err,
            list_foodBanks
          ) {
            if (err) {
              return next(err);
            }
            callback(null, list_foodBanks);
          });
        } else {
          FoodBank.find({}, { _id: 0 }).exec(function(err, list_foodBanks) {
            if (err) {
              return next(err);
            }
            callback(null, list_foodBanks);
          });
        }
      },
      function(food_bank_list, callback) {
        bounds(food_bank_list, callback);
      }
    ],
    function(err, results) {
      if (err) {
        return next(err);
      }
      // Successful, so render.
      res.send({
        title: "Food Bank List",
        FoodBank_list: results[0],
        province_lst: province_lst,
        city_list: results[1],
        bounds: results[2]
      });
    }
  );
};

//Display list of all FoodBanks by province
//Until forms are ready, make sure it can be displayed
exports.FoodBank_list_province = function(req, res, next) {
  async.waterfall(
    [
      function(callback) {
        FoodBank.find(
          { "properties.province": req.params.prov },
          { _id: 0 }
        ).exec(function(err, list_foodBanks) {
          if (err) {
            return next(err);
          }
          callback(null, list_foodBanks);
        });
      },
      function(food_bank_list, callback) {
        bounds(food_bank_list, callback);
      }
    ],
    function(err, results) {
      if (err) {
        return next(err);
      }
      // Successful, so render.
      res.send({
        title: "Food Bank List",
        FoodBank_list: null,
        province_lst: province_lst,
        city_list: results[1],
        bounds: results[2]
      });
    }
  );
};

//Display list of all FoodBanks by province
//Until forms are ready, make sure it can be displayed
exports.FoodBank_list_province_status = function(req, res, next) {
  async.waterfall(
    [
      function(callback) {
        var search = [];
        if (req.params.status !== "lmh") {
          search = search(req.params.status);
          FoodBank.find(
            { $or: search, "properties.province": req.params.prov },
            { _id: 0 }
          ).exec(function(err, list_foodBanks) {
            if (err) {
              return next(err);
            }
            callback(null, list_foodBanks);
          });
        } else {
          FoodBank.find(
            { "properties.province": req.params.prov },
            { _id: 0 }
          ).exec(function(err, list_foodBanks) {
            if (err) {
              return next(err);
            }
            callback(null, list_foodBanks);
          });
        }
      },
      function(food_bank_list, callback) {
        bounds(food_bank_list, callback);
      }
    ],
    function(err, results) {
      if (err) {
        return next(err);
      }
      // Successful, so render.
      res.send({
        title: "Food Bank List",
        FoodBank_list: results[0],
        province_lst: province_lst,
        city_list: results[1],
        bounds: results[2]
      });
    }
  );
};

exports.FoodBank_list_city = function(req, res, next) {
  async.waterfall(
    [
      function(callback) {
        FoodBank.find({ "properties.city": req.params.city }, { _id: 0 }).exec(
          function(err, list_foodBanks) {
            if (err) {
              return next(err);
            }
            callback(null, list_foodBanks);
          }
        );
      },
      function(food_bank_list, callback) {
        bounds(food_bank_list, callback);
      }
    ],
    function(err, results) {
      if (err) {
        return next(err);
      }
      // Successful, so render.
      res.send({
        title: "Food Bank List",
        FoodBank_list: null,
        province_lst: province_lst,
        city_list: results[1],
        bounds: results[2]
      });
    }
  );
};

exports.FoodBank_list_city_status = function(req, res, next) {
  async.waterfall(
    [
      function(callback) {
        var search = [];
        if (req.params.status !== "lmh") {
          search = search(req.params.status);
          FoodBank.find(
            { $or: search, "properties.city": req.params.city },
            { _id: 0 }
          ).exec(function(err, list_foodBanks) {
            if (err) {
              return next(err);
            }
            callback(null, list_foodBanks);
          });
        } else {
          FoodBank.find(
            { "properties.city": req.params.city },
            { _id: 0 }
          ).exec(function(err, list_foodBanks) {
            if (err) {
              return next(err);
            }
            callback(null, list_foodBanks);
          });
        }
      },
      function(food_bank_list, callback) {
        bounds(food_bank_list, callback);
      }
    ],
    function(err, results) {
      if (err) {
        return next(err);
      }
      // Successful, so render.
      res.send({
        title: "Food Bank List",
        FoodBank_list: results[0],
        province_lst: province_lst,
        city_list: results[1],
        bounds: results[2]
      });
    }
  );
};

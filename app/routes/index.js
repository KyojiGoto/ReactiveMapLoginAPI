var express = require("express");
var router = express.Router();

var FoodBank = require("../../app/models/FoodBank");

var foodBanksController = require("../../app/controllers/FoodBankController");

/* GET home page. */
router.get("/", foodBanksController.FoodBank_default);

/* GET home page. */
router.get("/status/", foodBanksController.FoodBank_list);

/* GET province page. */
router.get("/province/:prov/status/", foodBanksController.FoodBank_list_province);

/* GET city page*/
router.get("/city/:city/status/", foodBanksController.FoodBank_list_city);

/* GET home page. */
router.get("/status/:status", foodBanksController.FoodBank_list_status);

/* GET province page. */
router.get(
  "/province/:prov/status/:status",
  foodBanksController.FoodBank_list_province_status
);

/* GET city page*/
router.get(
  "/city/:city/status/:status",
  foodBanksController.FoodBank_list_city_status
);

/* GET city page*/
router.get(
  "province/:prov/city/:city/status/",
  foodBanksController.FoodBank_list_city_status
);

/* GET city page*/
router.get(
  "province/:prov/city/:city/status/:status",
  foodBanksController.FoodBank_list_city_status
);

router.post("/getBank", (req, res) => {
  FoodBank.findOne({ "properties.name" : req.body.foodbank}, function(err, foodbank) {
    return res.send({foodbank: foodbank});
  })
});

router.post("/updateBank", (req, res) => {
    FoodBank.findOneAndUpdate( {"properties.name": req.body.foodbank},  {'properties.status': req.body.status }, {}, function(err, foodbank){
      return res.status(200).send({foodbank: foodbank});
    });
});

module.exports = router;

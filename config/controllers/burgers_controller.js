var express = require('express');
var router = express.Router();
var db = require('../../models/');

router.get('/', function(req, res){
	res.redirect('/burgers')
});

router.get('/burgers', function(req, res){
	db.Burger.findAll({
		include: [db.Customer],
		order : [
			["burger_name", "ASC"]
		]
	})

	.then(function(dbBurger){
		var hbsObject = {
			burger : dbBurger
		};
		return res.render("index", hbsObject);
	});
});

router.post('/burgers/create', function(req, res){
	db.Burger.create({
		burger_name : req.body.burger_name
	})

	.then(function(dbBurger){
		console.log('dbBurger', dbBurger);

		res.redirect("/");
	});
});


router.put("/burgers/update", function(req, res) {
  // If we are given a customer, create the customer and give them this devoured burger
  if (req.body.customer) {
    db.Customer.create({
      customer: req.body.customer,
      BurgerId: req.body.burger_id
    })
    .then(function(dbCustomer) {
      return db.Burger.update({
        devoured: true
      }, {
        where: {
          id: req.body.burger_id
        }
      });
    })
    .then(function(dbBurger) {
      res.redirect("/");
    });
  }
  // If we aren't given a customer, just update the burger to be devoured
  else {
    db.Burger.update({
      devoured: true
    }, {
      where: {
        id: req.body.burger_id
      }
    })
    .then(function(dbBurger) {
      res.redirect("/");
    });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const User = require("../models/user");

router.post('/create', function(req, res){
	var source = ['POST /user/create'];
	User.create({
		name: req.body.name,
		access_token: req.body.token
	}).then(function(data){
		console.log(source, 'Success: userId:' + req.body.id + ' signed up');
		res.send(data);
	}).catch(function(e){
		console.log(source, e);
		res.status(500).send("Error signing up user");
	})
});

router.get('/:user_id', function(req, res){
	var source = ['GET /user/id'];
	User.findById(req.params.user_id)
	.then(function(user){
		console.log(source, 'Success: userId:' + req.body.id + ' got profile');
		res.send(user);
	}).catch(function(e){
		console.log(source, e);
		res.status(500).send("Error getting user");
	})
})	

router.post('/:user_id', function(req, res){
	var source = ['POST /user/id'];
	User.findById(req.params.user_id)
	.then(function(user){
		if(req.body.contact_number){
			user.updateAttributes({
				contact_number: req.body.contact_number
			}).then(function(){
				console.log("Success updating contact_number");
				//res.send(user);
			})
		}
		if(req.body.address){
			user.updateAttributes({
				address: req.body.address
			}).then(function(){
				console.log("Success updating address");
				//res.send(user);
			})
		}
		if(req.body.latitude){
			user.updateAttributes({
				latitude: req.body.latitude
			}).then(function(){
				console.log("Success updating latitude");
				//res.send(user);
			})
		}
		if(req.body.longitude){
			user.updateAttributes({
				longitude: req.body.longitude
			}).then(function(){
				console.log("Success updating longitude");
				//res.send(user);
			})
		}
		res.send("Success");
	}).catch(function(e){
		console.log(source, e);
		res.status(500).send("Error getting user");
	})
})	

module.exports = router
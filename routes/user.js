const express = require('express');
const router = express.Router();
const User = require("../models/user");
const Membership = require("../models/group").Membership;
const _ = require("lodash");
const passport = require("passport");

router.post('/create', function(req, res){
	var source = ['POST /user/create'];
	User.create({
		name: req.body.name,
		email: req.body.email,
		fid: req.body.fid,
		contact_number: req.body.contact_number,
		address: req.body.address,
		latitude: req.body.latitude,
		longitude: req.body.longitude
	}).then(function(data){
		console.log(source, 'Success: userId:' + req.body.id + ' signed up');
		res.json({
			user: data
		});
	}).catch(function(e){
		console.log(source, e);
		res.status(500).send("Error signing up user");
	})
});


router.get("/profile", passport.authenticate(["jwt"], { session: false }), (req, res) => {
    var source = ['GET /user/profile'];
    
    let userTokenSubject = req.user;
    User.findById(userTokenSubject.userId)
	.then(user => {
		res.json({
			user: user
		});
	})
	.catch(e => {
		console.log(source, e);
		res.status(500).send("Error getting user");
	})
});


router.get('/profile/:userId', passport.authenticate(["jwt"], { session: false }),(req, res) => {
	var source = ['GET /user/profile/:userId'];
	
	let userTokenSubject = req.user;

	User.findById(req.params.userId)
	.then(user2 => {
		res.json({
			user: user2
		});
	})
	.catch(e => {
		console.log(source, e);
		res.status(500).send("Error getting user");
	})	
})	

router.post('/update', passport.authenticate(["jwt"], { session: false }), (req, res) => {
	var source = ['POST /user/update'];
	let userTokenSubject = req.user;

	let userId = userTokenSubject.user.userId;
	let email = req.body.email;
	var contact_number = req.body.contact_number;
	var address = req.body.address;
	var longitude = req.body.longitude;
	var latitude = req.body.latitude;

	if (email) {
		if (email.indexOf("@") == -1) {
			res.json({
				status: "Error: Invalid Email"
			})
			return;
		}
	}
	
	if (contact_number) {
		contact_number = contact_number.trim().replace(" ", "");
		if (contact_number.length < 8) {
			res.json({
				status: "Error: Invalid Contact Number"
			})
			return;
		}
	}

	if (address) {
		address = address.trim();
		if (address.length == 0) {
			address = null;
		}
	}

	User.update({
		email: email,
		contact_number: contact_number,
		address: address,
		longitude: longitude,
		latitude: latitude
	},{
		where: {
			userId: userId
		}
	}).then((updateResult) => {
		if (updateResult[0] !== 1) {
			console.log(source, "error");
			res.json({
				status: "error"
			});
		} else {
			res.json({
				status: "success"
			});
		}
	})

	// let updatePromise = new Promise((resolve, reject) => {
	// 	User.findById(userTokenSubject.user.userId)
	// 	.then(function(user){
	// 		if(req.body.contact_number){
	// 			user.updateAttributes({
	// 				contact_number: req.body.contact_number
	// 			}).then(function(){
	// 				console.log("Success updating contact_number");
	// 				resolve(user);
	// 			})
	// 		}
	// 		if(req.body.address){
	// 			user.updateAttributes({
	// 				address: req.body.address
	// 			}).then(function(){
	// 				console.log("Success updating address");
	// 				resolve(user);
	// 			})
	// 		}
	// 		if(req.body.latitude){
	// 			user.updateAttributes({
	// 				latitude: req.body.latitude
	// 			}).then(function(){
	// 				console.log("Success updating latitude");
	// 				resolve(user);
	// 			})
	// 		}
	// 		if(req.body.longitude){
	// 			user.updateAttributes({
	// 				longitude: req.body.longitude
	// 			}).then(function(){
	// 				console.log("Success updating longitude");
	// 				resolve(user);
	// 			})
	// 		}	
	// 	}).catch(function(e){
	// 		console.log(source, e);
	// 		res.status(500).send("Error getting user");
	// 	})
	// });

	// updatePromise.then((user) => {
	// 	res.send(user);
	// })
	// .catch(function(e){
	// 	console.log(source, e);
	// 	res.status(500).send("Error updating user");
	// })

})	

module.exports = router
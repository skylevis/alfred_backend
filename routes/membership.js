const express = require('express');
const router = express.Router();
const User = require("../models/user");
const Group = require("../models/group").Group;
const Membership = require("../models/group").Membership;
const _ = require("lodash");
const passport = require("passport");
const passwordHash = require('password-hash');

router.post("/create", passport.authenticate(["jwt"], { session: false }), (req, res) => {
	var source = ['POST /membership/create'];
	let userTokenSubject = req.user;

	User.findById(userTokenSubject.user.userId)
	.then(user =>{
		Group.findOne({
			where: {
				name: req.body.name
			}
		})
		.then(group =>{
			if(passwordHash.verify(req.body.password, group.password)){
				group.addMember(user)
				.then(function(){
					console.log('user added to group');
					res.send({"status": "success"});
				})
			}
		})
		.catch(e =>{
			console.log(e);
			res.send({"status": "error"});
		})
	})
});

router.get("/", passport.authenticate(["jwt"], { session: false }), (req, res) => {
	var source = ['GET /membership'];
	let userTokenSubject = req.user;

	User.findOne({
		where: {
			userId:	userTokenSubject.user.userId
		},
		include: [{
	      model: Group,
	      as: 'Groupings',
	      attributes: {exclude: ['createdAt','updatedAt', 'password', 'ownerId']},
	      through: {attributes:[]},
	    }],
	})
	.then(groups => {
		res.json({
			group: groups.Groupings
		});
	})
	.catch(e => {
		console.log(source, e);
		res.send({
			"status": "error"
		})
	})
});

router.post("/delete", passport.authenticate(["jwt"], { session: false }), (req, res) => {
	var source = ['POST /membership/delete'];
	let userTokenSubject = req.user;

	User.findById(userTokenSubject.user.userId)
	.then(user =>{
		Group.findById(req.body.group.groupId)
		.then(group => {
			user.removeGrouping(group);
			res.send({"status": "success"});
		})
	})	
	.catch(e =>{
		console.log(e);
		res.send({"status": "error"});
	})
});

module.exports = router;


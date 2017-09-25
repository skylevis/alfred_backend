const express = require('express');
const router = express.Router();
const User = require("../models/user");
const Group = require("../models/group").Group;
const Membership = require("../models/group").Membership;
const _ = require("lodash");
const passport = require("passport");
const passwordHash = require('password-hash');

router.post("/create", passport.authenticate(["jwt"], { session: false }), (req, res) => {
	var source = ['POST /group/create'];
	let userTokenSubject = req.user;

	if(req.body.password.length >= 8){
		Group.create({
			name: req.body.name,
			password: passwordHash.generate(req.body.password),
			ownerId: userTokenSubject.user.userId
		})
		.then(group =>{
			User.findById(userTokenSubject.user.userId)
			.then(user => {
				user.addGroupings(group);
				res.send({
					"status": "success",
					"groupId": group.groupId,
			});
				console.log(source, 'Success: Created groupId:' + group.groupId);
			})
		})
		.catch(e => {
	      console.log(source, e);
	      res.send({"status": "error"});
	    })
	}
	else 
		res.send({"status": "error"});
});

router.get("/:groupId", passport.authenticate(["jwt"], { session: false }), (req, res) => {
	var source = ['GET /group/'];
	let userTokenSubject = req.user;

	User.findById(userTokenSubject.user.userId)
	.then(user => {
		Membership.findOne({
			where: {
				useruserId: user.userId,
				groupgroupId: req.params.groupId
			}
		})
		.then(membership => {
			Group.findOne({
				where: {
					groupId: req.params.groupId 
				},
				through: {attributes:[]},
				attributes: {exclude: ['createdAt','updatedAt','password']},
				include: [{
				    model: User,
				    as: 'Members',
				    attributes: {exclude: ['createdAt','updatedAt']},
				    through: {attributes:[]}
				}]
			})
			.then(group => {
				console.log(source, 'Success: Got groupId:' + group.groupId);
				res.json({
					group: group
				});
			})
			.catch(e => {
		      console.log(source, e);
		      res.send({"status": "error"});
		    })
		})
		.catch(e => {
		    console.log(source, e);
		    res.send({"status": "error"});
		})
	});
});

module.exports = router;
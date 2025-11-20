const mongoose = require('mongoose');

// Touite Schema
const touiteSchema = new mongoose.Schema({
	content: {
		type: String,
		required: true,
		maxlength: 280
	},
	accountId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Account',
		required: true,
	},
	tags: {
		type: [String],
		default: []
	},
	files: {
		type: [String],
		default: [],
		maxlength: 4
	},
	isAnswerTo: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Touite',
		default: null
	},
	isQuoteTo: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Touite',
		default: null
	},
	createdAt: {
		type: Date,
		default: Date.now
	},
	deletedAt: {
		type: Date,
		default: null
	}});
const Touite = mongoose.model('Touite', touiteSchema);
module.exports = Touite;
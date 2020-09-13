const express = require("express");
const bodyparser = require("body-parser");
const app = express();
const mongoose = require("mongoose");
app.set("view engine" , "ejs");
app.use(bodyparser.urlencoded({extended:true}));

// mongoose
mongoose.connect("mongodb://localhost:27017/formDB",{useNewUrlParser : true , useUnifiedTopology: true });
// Schema for holding input feilds
const inputSchema = new mongoose.Schema({
	label:String,
	type :String,
	required:String
});
// Schema for template of form
const template = new mongoose.Schema({
	feilds : [inputSchema]
});
// Schema for form values
const submissions = new mongoose.Schema({
	values : [{ }]
});
const Input = mongoose.model("Input" , inputSchema);
const Feild = mongoose.model("Feild", template);
const Submit = mongoose.model("Submit",submissions);

app.get ("/" ,function(req,res){
	res.sendFile(__dirname + "/feilds.html");
});
// for storing input feilds in template
app.post("/" , function(req ,res){
	var labels = req.body.label;
	var types = req.body.type;
	var checked = req.body.checked ; 
	if (checked === "on") {
		checked = true ; 
	}
	else{
		checked=false;
	}
	const newInput = new Input({
		label : labels,
		type : types,
		required : checked
	});
	newInput.save();
	Feild.find({} , function(err,feild){
		if(feild.length === 0){
			const feilD = new Feild({
				feilds : newInput
			});
			feilD.save();
		}
		else{
			feild.map(function (f){
				f.feilds.push(newInput);
				f.save();
			});
		}

	});
	res.redirect("/");
});
// creating form
app.get("/form" , function(req,res){
	Feild.find({} , function(err , feild){
		if(err){
			console.log(err);
		}
		else{
			feild.map(function(f){
				res.render("list" ,{feilds : f.feilds});
			})
			
		}
	})
	
});
// submitting values
app.post("/submit" , function(req,res){
	const formvalues = req.body;
	Submit.find({} , function(err , value){
		if(value.length === 0){
			const submitvalues = new Submit({
		      values : formvalues
           	});
	       submitvalues.save();
		}
		else{
			value.map(function(value){
				value.values.push(formvalues);
				value.save();
			})
		}
	})
	
	res.render("success");
});
// submitting another set of values for same form
app.post("/newResponse" , function(req ,res){
	res.redirect("/form");
});
// creating new form
app.post("/newForm" , function(req ,res){
	Submit.deleteMany({} , function(err){
		if(err){
			console.log(err);
		}
		else{
			console.log(" values deleted");
		}
	});
	Input.deleteMany({} , function(err){
		if(err){
			console.log(err);
		}
		else{
			console.log(" Feilds deleted deleted");
		}
	});
	Feild.deleteMany({} , function(err){
		if(err){
			console.log(err);
		}
		else{
			console.log("feild deleted");
		}
	});
	res.redirect("/");

});

app.listen( 3000 , function () {
	console.log("Server is running at port 3000");
});
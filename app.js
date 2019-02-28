var bodyParser       = require("body-parser"),
    expressSanitizer = require("express-sanitizer"),
	methodOverride   = require("method-override")
      mongoose       = require("mongoose"),
       express       = require("express"),
           app       = express();

mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true});

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

// MONGOOSE / MODEL CONFIG
var blogSchema = new mongoose.Schema({
	title: String,
	image: String,
	body: String,
	created: {type: Date, default: Date.now}	
});
var Blog = mongoose.model("Blog", blogSchema);

//MANUAL BLOG CREATIION

 /*Blog.create({
	title: "Test Blog",
	image: "https://images.unsplash.com/photo-1537123547273-e59f4f437f1b?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=6086121ab2201b250edd1054994522d3&auto=format&fit=crop&w=500&q=60",
	body : "This is a Blog Post "
});*/

//RESTFUL ROUTES
app.get("/", function(req, res){
	res.redirect("/blogs");
});


app.get("/blogs", function(req, res){

	Blog.find({}, function(err, blogs){
		if(err){
			alert("error");
			console.log(err);
		}else{
			res.render("index", {blogs : blogs});
		}
	});
});
// NEW ROUTE(FORM)
app.get("/blogs/new", function(req, res){
	res.render("new");
});

//CREATE NEW ROUTE(FORM SUBMISSION)
//CREATE BLOG
app.post("/blogs", function(req, res){
	//req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.create(/*data*/req.body.blog, /*Callback*/ function(err, newBlog){
		if(err){
			res.render("new");
// THEN REDIRECT TO THE INDEX			
		} else{
			res.redirect("/blogs");
		}
	});
});
//SHOW ROUTE
app.get("/blogs/:id", function(req,res){
	Blog.findById(req.params.id, function(err, foundBlog){
		if(err){
			res.redirect("/blogs");}
		else{
			res.render("show", {blog: foundBlog});
		}	
	});
});
//EDIT ROUTE7
app.get("/blogs/:id/edit", function(req,res){
	Blog.findById(req.params.id, function(err, foundBlog){
		if(err){
			res.redirect("/blogs");
		}else{
			res.render("edit", {blog: foundBlog});
		}
	});
	
});

//UPDATE ROUTE
app.put("/blogs/:id", function(req, res){
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
		if(err){
			res.redirect("/blogs");
		}else{
			res.redirect("/blogs/" + req.params.id);
		}
	});
});
//DELETE ROUTE
app.delete("/blogs/:id", function(req,res){
//destroy blog
	Blog.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/blogs");
		}else{
			res.redirect("/blogs");
		}
	});
});

app.listen(5000, process.env.IP, function(){
	console.log("Server Started");
});         
   
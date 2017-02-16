var express =  require("express")
var app = express();
app.use(express.static(__dirname+'/app'))

// app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.redirect('/views/bank_accounts/index.html');
});


var port =  process.env.PORT || 9000;
// require('./app/scripts/angular.js')(app);
// require('./app/scripts/angular-route.js')(app);
// require('./app/scripts/angular-resource.js')(app);
// require('./app/index.html')(app);

app.listen(port)
console.log("listen")
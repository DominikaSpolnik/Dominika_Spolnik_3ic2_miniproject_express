var express = require("express")
var app = express()
var PORT = process.env.PORT || 3000;

// tablica użytkowników
var users = [
    { id: 1, log: "AAA", pass: "PASS1", wiek: 10, uczen: "checked", plec: "m" },
    { id: 2, log: "BBB", pass: "PASS2", wiek: 12, uczen: undefined, plec: "k" },
    { id: 3, log: "CCC", pass: "PASS3", wiek: 9, uczen: "checked", plec: "m" },
    { id: 4, log: "DDD", pass: "PASS4", wiek: 14, uczen: undefined, plec: "k" },
    { id: 5, log: "EEE", pass: "PASS5", wiek: 3, uczen: "checked", plec: "m" }
]

// logowanie
var logged = false

// statyczne strony
app.use(express.static('static'))

var path = require("path")

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname + "/static/main.html"))
})

app.get("/register", function (req, res) {
    res.sendFile(path.join(__dirname + "/static/register.html"))
})

app.get("/login", function (req, res) {
    res.sendFile(path.join(__dirname + "/static/login.html"))
})

app.get("/admin", function (req, res) {
    if(logged==false){
        res.sendFile(path.join(__dirname + "/static/admin-denied.html"))
    }else if(logged==true){
        res.sendFile(path.join(__dirname + "/static/admin.html"))
    }
})

// formularz - rejestracja
var bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({ extended: true })); 

app.post("/register", function(req, res){

    var can_add = true

    for(var a=0; a<users.length;a++){
        if(users[a].log==req.body.login){
            res.send("<html><body>Użytkownik o poadnym loginie już istnieje. </body></html>")
            can_add = false
        }
    }

    if(can_add==true){
        res.send("<html><body>Witaj "+req.body.login+"! Zostałeś zarejestrowany. </body></html>")
        users.push({id: users.length+1, log: req.body.login, pass: req.body.password, wiek: req.body.age, uczen: req.body.student, plec: req.body.plec})
        console.log(users)
    }
    
})

// formularz - logowanie
app.post("/login", function(req, res){

    var can_log = false

    for(var a=0; a<users.length;a++){
       if(users[a].log==req.body.login && users[a].pass==req.body.password){
            can_log=true
            logged=true
            res.redirect("/admin")
       }
    }

    if(can_log==false){
        res.send("<html><body>Błędny login lub hasło. Jeśli nie posiadasz konta musisz się najpierw zarejestrować.</body></html>")
    }
    
})

// admin - logout
app.get("/logout", function (req, res) {
    logged=false
    res.redirect("/")
})

// admin page - stringi
app.get("/sort", function (req, res) {
    if(logged==true){
        var output_page_1_default = "<!DOCTYPE html><html lang='en'><head><meta charset='UTF-8'><meta name='viewport' content='width=device-width, initial-scale=1.0'><title>Show</title><link rel='stylesheet' href='style.css'></head><body style='background-color:  #1d1c1e;'><div class='header' style='background-color: #1d1c1e;'><a href='/sort'>sort</a><a href='/gender'>gender</a><a href='/show'>show</a></div>"
        var output_page_2 = "</body></html>"

        var form_page = "<form action='/sort' method='POST' onchange='this.submit()' id='sort_form'><label for='sort_type'>rosnąco: </label><input type='radio' name='sort_type' value='rosnaco' id='radio_rosnaco'><label for='sort_type'>malejąco: </label><input type='radio' name='sort_type' value='malejaco'  id='radio_malejaco' ></form>"

        var output_page_1 = output_page_1_default + form_page

        var table = "<div class='table'>"
        for(var a=0; a<users.length; a++){
            table = table + " <div class='table_row'> <div class='id_cell'>id: "+users[a].id+"</div> <div class='user_cell'>user: "+users[a].log+" - "+users[a].pass+"</div> <div class='age_cell'>wiek: "+users[a].wiek+"</div> </div>"
        }
        table=table + "</div>"

        res.send(output_page_1+table+output_page_2)

        var bodyParser = require("body-parser")
        app.use(bodyParser.urlencoded({ extended: true })); 

        app.post("/sort", function(req, res){
            if (req.body.sort_type == "rosnaco") {
                output_page_1=""
                var form_page_rosnaco = "<form action='/sort' method='POST' onchange='this.submit()' id='sort_form'><label for='sort_type'>rosnąco: </label><input type='radio' name='sort_type' value='rosnaco' id='radio_rosnaco' checked><label for='sort_type'>malejąco: </label><input type='radio' name='sort_type' value='malejaco'  id='radio_malejaco' ></form>"
                output_page_1=output_page_1_default+ form_page_rosnaco
                
                users.sort(function (a, b) {
                    return parseFloat(a.wiek) - parseFloat(b.wiek);
                });

                var table = "<div class='table'>"
                for(var a=0; a<users.length; a++){
                    table = table + " <div class='table_row'> <div class='id_cell'>id: "+users[a].id+"</div> <div class='user_cell'>user: "+users[a].log+" - "+users[a].pass+"</div> <div class='age_cell'>wiek: "+users[a].wiek+"</div> </div>"
                }
                table=table + "</div>"
                
            }else if(req.body.sort_type == "malejaco"){
                output_page_1=""
                var form_page_malejaco = "<form action='/sort' method='POST' onchange='this.submit()' id='sort_form'><label for='sort_type'>rosnąco: </label><input type='radio' name='sort_type' value='rosnaco' id='radio_rosnaco' ><label for='sort_type'>malejąco: </label><input type='radio' name='sort_type' value='malejaco'  id='radio_malejaco' checked ></form>"
                output_page_1=output_page_1_default+ form_page_malejaco
                
                users.sort(function (a, b) {
                    return parseFloat(b.wiek) - parseFloat(a.wiek);
                });
                var table = "<div class='table'>"
                for(var a=0; a<users.length; a++){
                    table = table + " <div class='table_row'> <div class='id_cell'>id: "+users[a].id+"</div> <div class='user_cell'>user: "+users[a].log+" - "+users[a].pass+"</div> <div class='age_cell'>wiek: "+users[a].wiek+"</div> </div>"
                }
                table=table + "</div>"
            }
            res.send(output_page_1+table+output_page_2)
        })

    }else{
        res.sendFile(path.join(__dirname + "/static/admin-denied.html"))
    }
})

app.get("/gender", function (req, res) {
    if(logged==true){
        users.sort(function (a, b) {
            return parseFloat(a.id) - parseFloat(b.id);
        });

        var output_page_1 = "<!DOCTYPE html><html lang='en'><head><meta charset='UTF-8'><meta name='viewport' content='width=device-width, initial-scale=1.0'><title>Show</title><link rel='stylesheet' href='style.css'></head><body style='background-color:  #1d1c1e;'><div class='header' style='background-color: #1d1c1e;'><a href='/sort'>sort</a><a href='/gender'>gender</a><a href='/show'>show</a></div>"
        var output_page_2 = "</body></html>"

        var table_k = "<div class='table'>"
        var table_m = "<div class='table'>"
        for(var a=0; a<users.length; a++){
            if(users[a].plec=="k"){
                table_k = table_k + " <div class='table_row'> <div class='id_cell'>id: "+users[a].id+"</div> <div class='plec_cell'>płeć: "+users[a].plec+"</div> </div>"
            }else if(users[a].plec=="m"){
                table_m = table_m + " <div class='table_row'> <div class='id_cell'>id: "+users[a].id+"</div> <div class='plec_cell'>płeć: "+users[a].plec+"</div> </div>"
            }
        }
        table_k=table_k + "</div>"
        table_m=table_m + "</div>"

        res.send(output_page_1+table_k+table_m+output_page_2)
    }else{
        res.sendFile(path.join(__dirname + "/static/admin-denied.html"))
    }
})

app.get("/show", function (req, res) {
    if(logged==true){
        var output_page_1 = "<!DOCTYPE html><html lang='en'><head><meta charset='UTF-8'><meta name='viewport' content='width=device-width, initial-scale=1.0'><title>Show</title><link rel='stylesheet' href='style.css'></head><body style='background-color:  #1d1c1e;'><div class='header' style='background-color: #1d1c1e;'><a href='/sort'>sort</a><a href='/gender'>gender</a><a href='/show'>show</a></div>"
        var output_page_2 = "</body></html>"

        users.sort(function (a, b) {
            return parseFloat(a.id) - parseFloat(b.id);
        });

        var table = "<div class='table'>"
        for(var a=0; a<users.length; a++){
            if(users[a].uczen=="checked"){
            var checkbox = "<input type='checkbox'  style='margin-top: 32px;' checked disabled>"
            }else{
                var checkbox = "<input type='checkbox' style='margin-top: 32px;' disabled >"
            }
            table = table + " <div class='table_row'> <div class='id_cell'>id: "+users[a].id+"</div> <div class='user_cell'>user: "+users[a].log+" - "+users[a].pass+"</div> <div class='student_cell'>uczeń: "+checkbox+"</div> <div class='age_cell'>wiek: "+users[a].wiek+"</div> <div class='plec_cell'>płeć: "+users[a].plec+"</div> </div>"
        }
        table=table + "</div>"

        res.send(output_page_1+table+output_page_2)
    }else{
        res.sendFile(path.join(__dirname + "/static/admin-denied.html"))
    }
})

// port
app.listen(PORT, function () { 
    console.log("start serwera na porcie " + PORT )
})
const express = require("express");
const mongoClient = require("mongodb").MongoClient;
const cors = require("cors");
const { cli } = require("webpack-dev-server");
const { data } = require("jquery");

const app = express();
app.use(cors());

app.use(express.urlencoded({
    extended:true
}));
app.use(express.json());

const constr = "mongodb://127.0.0.1:27017";

app.get("/users",(request,response)=>{
    mongoClient.connect(constr)
    .then(clientObject=>{
        var database = clientObject.db("tododb");
        database.collection("users").find({}).toArray()
        .then(document=>{
            response.send(document);
            response.end();
        });
    });
});

app.post("/register-user",(request,response)=>{
    var users = {
        UserId:request.body.UserId,
        UserName:request.body.UserName,
        Password: request.body.Password,
        Email: request.body.Email,
        Mobile: request.body.Mobile
    };
    mongoClient.connect(constr)
    .then(clientObject=>{
        var database = clientObject.db("tododb");
        database.collection("users").insertOne(users)
        .then(()=>{
            console.log("New User Added");
            response.redirect("/users");
        });
    });
});

app.get("/appointments/:userid",(request,response)=>{
    mongoClient.connect(constr)
    .then(clientObject=>{
        var database = clientObject.db("tododb");
        database.collection("appointments").find({UserId:request.params.userid}).toArray()
        .then(documents=>{
            response.send(documents);
            response.end();
        });
    });
});

app.post("/add-task",(request,response)=>{
    var task = {
        Id:parseInt(request.body.Id),
        Title:request.body.Title,
        Date:new Date(request.body.Date).toLocaleDateString(),
        Description:request.body.Description,
        UserId:request.body.UserId
    };

    mongoClient.connect(constr)
    .then(clientObject=>{
        var database = clientObject.db("tododb");
        database.collection("appointments").insertOne(task)
        .then(()=>{
            console.log("Task Added");
            response.end();
        });
    });
});

app.get("/get-byid/:id", (request, response)=>{
    mongoClient.connect(constr).then(clientObject=>{
        var database = clientObject.db("tododb");
        database.collection("appointments").find({Id:parseInt(request.params.id)}).toArray().then(documents=>{
            response.send(documents);
            response.end();
        });
    });
})

app.put("/edit-task/:id",(request,response)=>{
    // var id = parseInt(request.params.Id);
    // var title = request.params.Title;
    // var date = request.params.Date;
    // var description = request.params.Description;
    // var userid = request.params.UserId;
   
    mongoClient.connect(constr)
    .then(clientObject=>{
        var database = clientObject.db("tododb");
        database.collection("appointments").updateOne({},
            {$set:
                {Id:parseInt(request.body.Id),
                    Title:request.body.Title,
                    Date: new Date(request.body.Date).toLocaleDateString(),
                    Description: request.body.Description,
                    UserId:request.body.UserId}
                })
        .then(()=>{
            console.log("Task Updated");
            response.end();
        })
    })
})


app.delete("/delete-task/:id",(request,response)=>{
    var id = parseInt(request.params.id);
    mongoClient.connect(constr)
    .then(clientObject=>{
        var database = clientObject.db("tododb");
        database.collection("appointments").deleteOne({Id:id})
        .then(()=>{
            console.log("Task Deleted");
            response.end();
        });
    });
});

app.listen(6060);
console.log("Server started : http://127.0.0.1:6060");
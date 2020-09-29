const uniqid = require('uniqid');
const fs = require("fs");
const path = require("path");

//let db = require("../db/db.json")

module.exports = function(app) {

    app.get("/api/notes", function(req, res) {

        fs.readFile(path.join(__dirname, "../db/db.json"), "utf8", (err, data) => {
            if (err) throw err;
            res.json(JSON.parse(data));
        });

    });

    app.post("/api/notes", function(req, res){

        let newNote = req.body
        newNote.id = uniqid()

        console.log("Note ID: " + newNote.id)

        return (fs.readFile((path.join(__dirname,"../db/db.json")), function (err, data){
            if (err) throw err;

            let notes = JSON.parse(data)
            notes.push(newNote)

            fs.writeFile((path.join(__dirname,"../db/db.json")), JSON.stringify(notes), (err) => {

                if (err) throw err;
                console.log("Success!")

            });

            res.send();

        }));
    });

    app.delete("/api/notes/:id", function(req, res) {

        const noteId = parseInt(req.params.id);

        fs.readFile(path.join(__dirname, "../db/db.json"), function(err, data) {
            if (err) throw err;
            
            const db = JSON.parse(data);
            const updatedDB = [];
    
            for(let i = 0; i < db.length; i++)
            {
                if (i !== noteId)
                {
                    const newNote = {
                        title: db[i].title,
                        text: db[i].text,
                        id: updatedDB.length
                    };
    
                    updatedDB.push(newNote);
                }
            }
            
            fs.writeFile(path.join(__dirname, "../db/db.json"), JSON.stringify(updatedDB), function(err) {
                if (err) throw err;

                res.send(req.body);

                console.log("Note Deleted!")
            });
            
        });
    });
};

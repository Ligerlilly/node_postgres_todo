var express = require('express');
var router = express.Router();
var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/todo';
var path = require('path');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../views', 'index.html'));
});

router.post('/api/v1/todos', function(req, res) {
  var results = [];

  var data = {text: req.body.text, complete: false};

  pg.connect(connectionString, function(err, client, done) {

    client.query("INSERT INTO items (text, complete) values ($1, $2)", [data.text, data.complete]);

    var query = client.query("SELECT * FROM items ORDER BY id ASC");

    query.on('row', function(row) {
      results.push(row);
    });

    query.on('end', function() {
      client.end();
      return res.json(results);
    });

    if(err) {
      console.log(err);
    }

  });
});

router.get('/api/v1/todos', function(req, res) {

    var results = [];

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {

        // SQL Query > Select Data
        var query = client.query("SELECT * FROM items ORDER BY id ASC;");

        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            client.end();
            return res.json(results);
        });

        // Handle Errors
        if(err) {
          console.log(err);
        }

    });

});

router.put('/api/v1/todos/:todo_id', function(req, res) {

  var results = [];
  var id = req.params.todo_id;
  var data = {text: req.body.text, complete: req.body.complete};

  pg.connect(connectionString, function(err, client, done) {

    client.query("UPDATE items SET text=($1), complete=($2) WHERE id=($3)", [data.text, data.complete, id]);

    var query = client.query("SELECT * FROM items ORDER BY id ASC");

    query.on('row', function() {
      results.push(row);
    });

    query.on('end', function() {
      client.end();
      return res.json(results);
    });

    if(err) {
      console.log(err);
    }
  });
});

router.delete('/api/v1/todos/:todo_id', function(req, res) {
  var results = [];

  var id = req.params.todo_id;

  pg.connect(connectionString, function(err, client, done) {
    client.query('DELETE FROM items WHERE id = ($1)', [id]);

    var query = client.query('SELECT * FROM items ORDER BY id ASC');

    query.on('row', function(row) {
      results.push(row);
    });

    query.on('end', function() {
      client.end();
      return res.json(results);
    });

    if(err) {
      console.log(err);
    }
  });

});
router.get('/api/v1/todos/:todo_id', function(req, res) {
  var results = [];

  var id = req.params.todo_id;
  console.log(id);
  pg.connect(connectionString, function(err, client, done) {
    var query = client.query("SELECT * FROM items WHERE id=($1);", [id]);

    query.on('row', function(row) {
      results.push(row);
    });

    query.on('end', function() {
      client.end();
      return res.json(results);
    });

    if(err){
      console.log(err);
    }

  });
});
module.exports = router;

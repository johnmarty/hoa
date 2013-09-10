exports.dbView = function(req, res){
  var  db = require('../data/data')
  , name = req.params.name
  , stateLink = require('../modules/stateLink').init(username);
  ;

  db.view('thefountains/' + name
    , function (err, doc) {
      if (err) {
        res.status(404).render('error.ejs', { 
        	error: "oops", 
        	reason: JSON.stringify(err), 
            stateLinkUrl: stateLink.url,
            stateLinkCopy: stateLink.copy
        });
      }
      res.setHeader('Content-Type', 'application/json');
      res.send( JSON.stringify(doc) );
    }
  );
};

exports.users = function(req, res){
  //eg: /update/meals_per_day/4
  var  db = require('../data/data')
  , stateLink = require('../modules/stateLink').init(username);
  ;

  db.view('thefountains/user-profile'  
    , function (err, doc) {
      if (err) {
        res.status(404).render('error.ejs', { 
        	error: "oops", 
        	reason: JSON.stringify(err),
            stateLinkUrl: stateLink.url,
            stateLinkCopy: stateLink.copy
        });
      }
      res.setHeader('Content-Type', 'application/json');
      res.send( JSON.stringify(doc) );
    }
  );
}; 

exports.updateUser = function(req, res){

  var  db = require('../data/data')
  , name = req.params.name
  , updatedProfile = req.body // so if the save is successful we need to update the session profile
  , serverResponse = res
  , serverRequest = req
  , stateLink = require('../modules/stateLink').init(username);
  ;
  
  db.merge(name, req.body, function (err, res) {
    if(err){
      serverResponse.status(400).render('error.ejs', { 
    	  error: "oops", 
    	  reason: JSON.stringify(err), 
    	  stateLinkUrl: stateLink.url,
    	  stateLinkCopy: stateLink.copy
      });
    }
    db.get( req.session.username, function (err, doc) {
      if(err) {
        serverResponse.status(404).render('error.ejs', { 
    	  error: "oops", 
    	  reason: JSON.stringify(err), 
    	  stateLinkUrl: stateLink.url,
    	  stateLinkCopy: stateLink.copy
        });
      }
      var evo = require('../modules/metabolicProfile').init(doc);
      serverResponse.setHeader('Content-Type', 'application/json');
      serverResponse.send(JSON.stringify(evo.profile));

    });
  });
  
};

exports.recipes = function(req, res){
  var  db = require('../data/data')
  , stateLink = require('../modules/stateLink').init(username);
  ;

  db.view('thefountains/recipes'  
    , function (err, doc) {
      if(err) {
        res.status(404).render('error.ejs', { 
    	  error: "oops", 
    	  reason: JSON.stringify(err), 
    	  stateLinkUrl: stateLink.url,
    	  stateLinkCopy: stateLink.copy
      });
      }
      // lets loop the doc and move value props to the top level and only return the 
      // array of objects so its pairs nicely with the backbone collection
      var recipes = [];

      for (var i = 0; i < doc.length; i++) {
        // we must have an id for backbone.colleciton.get(id);
        doc[i].value.id = doc[i].id;
        recipes.push(doc[i].value);
      }
      res.setHeader('Content-Type', 'application/json');
      res.send( JSON.stringify(recipes) );

    }
  );
};

exports.getUser = function(req, res){
  var  db = require('../data/data')
  , name = req.params.name
  , stateLink = require('../modules/stateLink').init(username);
  ;

  db.get( name, function (err, doc) {
    if(err) {
      res.status(404).render('error.ejs', { 
    	  error: "oops", 
    	  reason: JSON.stringify(err), 
    	  stateLinkUrl: stateLink.url,
    	  stateLinkCopy: stateLink.copy
      });
    }

    var evo = require('../modules/metabolicProfile').init(doc);

    res.setHeader('Content-Type', 'application/json');
    res.send( JSON.stringify(evo.profile) );
  });
};

exports.getRecipe = function(req, res){
  var  db = require('../data/data')
  , id = req.params.id
  , stateLink = require('../modules/stateLink').init(username);
  ;

  db.get( id, function (err, doc) {
    if(err) {
      res.status(404).render('error.ejs', { 
    	  error: "oops", 
    	  reason: JSON.stringify(err), 
    	  stateLinkUrl: stateLink.url,
    	  stateLinkCopy: stateLink.copy
      });
    }
    res.setHeader('Content-Type', 'application/json');
    res.send( JSON.stringify(doc) );
  });
};

exports.saveRecipe = function(req, res){
  var  db = require('../data/data')
  , id = req.params.id
  , recipeDoc = req.body
  , serverRes = res
  , stateLink = require('../modules/stateLink').init(username);
  ;

  //clean up _rev : required by cradle merge
  delete recipeDoc._rev;
  //clean up value, i suspect backbone is adding this, its the previous state of the recipe model
  delete recipeDoc.value;
  //clean up id and key,
  delete recipeDoc.id;
  delete recipeDoc.key;
  
  db.merge(id, recipeDoc, function (err, res) {
      // Handle response
      if(err){
        console.log('issue saving recipe');
        console.log(err);
      } else {
        console.log('saved recipe ' + id);
        console.log(recipeDoc);
        serverRes.send({ 'recipe':recipeDoc});

      }
  });  
/*
*/
};

exports.deleteRecipe = function(req, res){
  var  db = require('../data/data')
  , id = req.params.id
  , serverRes = res
  , stateLink = require('../modules/stateLink').init(username);
  ;

  db.get( id, function (err, doc) {
    if(err) {
      serverRes.status(404).render('error.ejs', { 
    	  error: "oops", 
    	  reason: JSON.stringify(err), 
    	  stateLinkUrl: stateLink.url,
    	  stateLinkCopy: stateLink.copy
      });
    }
      console.log(doc._rev);
      db.remove(id, doc._rev, function (err, res) {
          // Handle response
          if(err){
            console.log('issue deleting recipe');
            console.log(err);
          } else {
            console.log('deleted recipe ' + id);
            console.log(res);
            serverRes.setHeader('Content-Type', 'application/json');
            serverRes.send( {'message':'recipe deleted'} );
          }
      });  
  });

};

exports.updateRecipe = function(req, res){
  var  db = require('../data/data')
  , id = req.params.id
  , jsonReq = JSON.stringify(req.body) // only for logging at this point
  , doc = req.session.profile.username // TODO: authenticate user has permission
  , stateLink = require('../modules/stateLink').init(username);
  ;
  
  db.merge(id, req.body, function (err, res) {
    if(err){
      res.status(400).render('error.ejs', { 
    	  error: "oops", 
    	  reason: JSON.stringify(err), 
    	  stateLinkUrl: stateLink.url,
    	  stateLinkCopy: stateLink.copy
      });
    }
  });
  res.setHeader('Content-Type', 'application/json');
  res.send(jsonReq);
};

exports.updateRecipeDocs = function(req, res){
  res.send( "disabled" );
  /*
remove comments and modify method to globally change recipe docs
USE CAUTION
  var  db = require('../data/data')
  
  db.view('thefountains/recipes' 
    , function (err, doc) {
      if(err) {
        res.status(404).render('error.ejs', { error: "oops", reason: JSON.stringify(err) } );
      }
      for (var i = doc.length - 1; i >= 0; i--) {
        var recipe = doc[i].value;
        recipe.system_doc_type = recipe.docType;
        delete recipe.docType;
        recipe.system_unique_id = recipe.unique_id;
        delete recipe.unique_id;
        console.log(recipe);
        console.log("-----------------------------------------------------------------------");
        db.save(recipe.system_unique_id, recipe, function (err, res) {
            if (err) {
                // Handle error
              console.log('there was an error saving this doc');
              console.log(err);
            } else {
              console.log('recipe saved!');
                // Handle success
            }
        });
      }
      //res.setHeader('Content-Type', 'application/json');
      //res.send( JSON.stringify(doc) );

    }
  );
  res.send('done');
  */

};

exports.generateRecipes = function(req, res){
  res.send('done already please clean db before doing this again');
  /*
  var  db = require('../data/data')
  ;
  db.get('recipes'
    , function (err, doc) {
      if(err) {
        res.status(404).render('error.ejs', { error: "oops", reason: JSON.stringify(err) } );
      }
      //console.log(JSON.stringify(doc.entries));
      res.setHeader('Content-Type', 'application/json');
      //res.send( JSON.stringify(doc.entries) );
      for (var i = doc.entries.length - 1; i >= 0; i--) {
        doc.entries[i].docType = "recipe";
        doc.entries[i]._id = doc.entries[i].unique_id;
        db.save(doc.entries[i].unique_id, doc.entries[i], function (err, res) {
            if (err) {
                // Handle error
              console.log('there was an error saving this doc');
              console.log(err);
            } else {
              console.log('recipe saved!');
                // Handle success
            }
        });

      };
    }
  );
  */


};


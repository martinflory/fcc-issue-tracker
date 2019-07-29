/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var ObjectID = require('mongodb').ObjectID;
var MDB = require('../db');
const { body, validationResult } = require('express-validator')
module.exports = function (app) {
          // The method Validate uses express-validator to validate incoming parameters to the different requests and creates erorr message
          var validate = (method) => {
            switch (method) {
              case 'createIssue': {
               return [ 
                  body('issue_title').exists(),
                  body('issue_text').exists(),
                  body('created_by').exists(),
                  body('assigned_to').optional(),
                  body('status_text').optional()
                 ]   
              }
              case 'updateIssue': {
               return [ 
                  body('_id').exists().isMongoId(),
                  body('issue_title').optional(),
                  body('issue_text').optional(),
                  body('created_by').optional(),
                  body('assigned_to').optional(),
                  body('status_text').optional(),
                  body('open').optional().isBoolean()
                 ]   
              }

            }
          }
          
          app.route('/api/issues/:project')

          .get(function (req, res){
            var project = req.params.project;
            var db=MDB.get();
            var query={};
            
            if (req.query.issue_title) query.issue_title=req.query.issue_title;
            if (req.query.issue_text) query.issue_text=req.query.issue_text;
            if (req.query.created_by) query.created_by=req.query.created_by;
            if (req.query.assigned_to) query.assigned_to=req.query.assigned_to;
            if (req.query.status_text) query.status_text=req.query.status_text;
            if (req.query.open) query.open=req.query.open;
            if (req.query._id) query._id=new ObjectID(req.query._id);
            
            
            db.collection(project).find(query).toArray((err, docs) => {
                if(err) {
                  console.log('ERROR: ' + err)
                  res.json([{}]);
                } else {
                  res.json(docs);
                }
            });
          })

          .post(validate('createIssue'), function (req, res){
            const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions
            if (!errors.isEmpty()) {
              res.status(422).json({ errors: errors.array() });
              return;
            }
            
            var project = req.params.project;

            var db=MDB.get();
            var obj={
            issue_title: req.body.issue_title,
            issue_text:  req.body.issue_text,
            created_by:  req.body.created_by,
            assigned_to: req.body.assigned_to || "",
            status_text: req.body.status_text || "",
            created_on: new Date(),
            updated_on: new Date(),
            open: true}
          db.collection(project).insertOne(obj
            ,(err, doc) => {
                if(err) {
                    console.log(err);
                    res.redirect('/');
                } else {
                    res.json([obj]);
                }
            });
         
          })

          .put(validate('updateIssue'), function (req, res){
            const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions
            if (!errors.isEmpty()) {
              res.status(422).json({ errors: errors.array() });
              return;
            }
            var project = req.params.project;
            var db=MDB.get();
            var update={}

            console.log(req.body);
            if (req.body.issue_title) update.issue_title=req.body.issue_title;
            if (req.body.issue_text) update.issue_text=req.body.issue_text;
            if (req.body.created_by) update.created_by=req.body.created_by;
            if (req.body.assigned_to) update.assigned_to=req.body.assigned_to;
            if (req.body.status_text) update.status_text=req.body.status_text;
            if (req.body.open) update.open= (req.body.open==='true');
            
            // if no fields are provided, nothing to update
            if (JSON.stringify(update)===JSON.stringify({})) return res.json({ message: 'no updated field sent'});
            
            //debug
            update.updated_on= new Date();
          
            db.collection(project).findOneAndUpdate(
              { _id: new ObjectID(req.body._id)},
              {  $set: update },
           {returnOriginal: false}
            ,(err, doc) => {
                if(err) {
                    res.json({ message: 'could not update '+ req.body._id });
                } else {
                    if (doc.lastErrorObject.updatedExisting==false) return res.json({ message: 'could not update '+ req.body._id });
                    else return res.json({ message: 'successfully updated' });
                }
            });
        
          })

          .delete(function (req, res){
            var project = req.params.project;
            var db=MDB.get();
            if (!req.body._id) return res.json({message: '_id error'})
            
            console.log(req.body)
            db.collection(project).deleteOne({ _id: new ObjectID(req.body._id) },(err, doc) => {
                if(err) {
                    return res.json({ message: 'could not delete '+ req.body._id });
                } else {
                    if (doc.deletedCount==1) return res.json({ message: 'deleted '+ req.body._id })
                    else return res.json({ message: 'could not delete '+ req.body._id });;
                }
            });
            
          });
    }        

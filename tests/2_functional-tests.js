/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
chai.use(require('chai-datetime'));
var assert = chai.assert;
var expect = chai.expect;
var should = chai.should();
var ObjectID = require('mongodb').ObjectID;

var server = require('../server');
chai.config.includeStack = true;
chai.use(chaiHttp);

suite('Functional Tests', function() {
  var id=null;
//   Prevent cross site scripting(XSS attack).
  
    suite('POST /api/issues/{project} => object with issue data', function() {
// I can POST /api/issues/{projectname} with form data containing required issue_title, issue_text, 
// created_by, and optional assigned_to and status_text.
// The object saved (and returned) will include all of those fields (blank for optional no input) and 
// also include created_on(date/time), updated_on(date/time), open(boolean, true for open, false for closed), and _id.
      
      test('Every field filled in', function(done) {
        var before = new Date();
       chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in',
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA'
        })
        .end(function(err, res){
         if (err) {
           console.log(err);
           return done(err);
         }try{
           
          // Make sure that all times on a file node are within a 1 minute window

          var after = new Date();
           
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          id=res.body[0]._id;
          assert.propertyVal(res.body[0], 'issue_title', 'Title');
          assert.propertyVal(res.body[0], 'issue_text',  'text');
          assert.propertyVal(res.body[0], 'created_by',  'Functional Test - Every field filled in');
          assert.propertyVal(res.body[0], 'assigned_to', 'Chai and Mocha');
          assert.propertyVal(res.body[0], 'status_text', 'In QA');
          expect(new Date(res.body[0].created_on)).to.be.withinDate(before, after);
          expect(new Date(res.body[0].updated_on)).to.be.withinDate(before, after);
           
         } catch(err){
           console.log(err)
           return done(err);
         } 
           done();
          
        });
        
      });
      
      test('Required fields filled in', function(done) {
                var before = new Date();
       chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in',
       })
        .end(function(err, res){
         if (err) {
           console.log(err);
           return done(err);
         }try{
           
          // Make sure that all times on a file node are within a 1 minute window

          var after = new Date();
           
          assert.equal(res.status, 200);
          assert.isArray(res.body);
 
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], '_id');

          assert.propertyVal(res.body[0], 'issue_title', 'Title');
          assert.propertyVal(res.body[0], 'issue_text',  'text');
          assert.propertyVal(res.body[0], 'created_by',  'Functional Test - Every field filled in');
          assert.propertyVal(res.body[0], 'assigned_to', '');
          assert.propertyVal(res.body[0], 'status_text', '');
          assert.property(res.body[0], 'created_on');
          expect(new Date(res.body[0].created_on)).to.be.withinDate(before, after);
          assert.property(res.body[0], 'updated_on');
          expect(new Date(res.body[0].updated_on)).to.be.withinDate(before, after);
           
         } catch(err){
           console.log(err)
           return done(err);
         } 
           done();
          
        });
        
      });
      
      test('Missing required fields', function(done) {
                var before = new Date();
       chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          created_by: 'Functional Test - Every field filled in',
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA'
        })
        .end(function(err, res){
         if (err) {
           console.log(err);
           return done(err);
         }try{
           
          // Make sure that all times on a file node are within a 1 minute window

          var after = new Date();
          assert.equal(res.status, 422);
           
         } catch(err){
           console.log(err)
           return done(err);
         } 
           done();
          
        });
        
      });
      
    });
    
    suite('PUT /api/issues/{project} => text', function() {
// I can PUT /api/issues/{projectname} with a _id and any fields in the object with a value to object said object. Returned will be 'successfully updated' or 'could not update '+_id. This should always update updated_on. If no fields are sent return 'no updated field sent'.
 
      
      test('No body', function(done) {
                var before = new Date();
       chai.request(server)
        .put('/api/issues/test')
        .send({
          _id: id
        })
        .end(function(err, res){
         if (err) {
           console.log(err);
           return done(err);
         }try{
           assert.equal(res.status, 200);
          assert.propertyVal(res.body, 'message', 'no updated field sent');
           
         } catch(err){
           console.log(err)
           return done(err);
         } 
           done();
          
        });
        
      });
      
      test('One field to update', function(done) {
                      var before = new Date();
       chai.request(server)
        .put('/api/issues/test')
        .send({
          _id: id,
          issue_text: 'text PUT'
       })
        .end(function(err, res){
         if (err) {
           console.log(err);
           return done(err);
         }try{
           assert.equal(res.status, 200);
           assert.propertyVal(res.body, 'message', 'successfully updated');
           
         } catch(err){
           console.log(err)
           return done(err);
         } 
           done();
          
        });  
      });
      
      test('Bad ID', function(done) {

        let badId=new ObjectID();
       chai.request(server)
        .put('/api/issues/test')
        .send({
          _id: badId,
          issue_text: 'text PUT'
       })
        .end(function(err, res){
         if (err) {
           console.log(err);
           return done(err);
         }try{
           assert.equal(res.status, 200);
           assert.propertyVal(res.body, 'message', 'could not update '+ badId);

         } catch(err){
           console.log(err)
           return done(err);
         } 
           done();
          
        });  
      });
      
      test('Multiple fields to update', function(done) {
                      var before = new Date();
       chai.request(server)
        .put('/api/issues/test')
        .send({
          _id: id,
          issue_text: 'text PUT',
          created_by: 'Functional Test PUT - Every field filled in',
          assigned_to: 'Chai and Mocha PUT',
          status_text: 'In QA PUT',
         open: false
        })
        .end(function(err, res){
         if (err) {
           console.log(err);
           return done(err);
         }try{
            assert.equal(res.status, 200);
            assert.propertyVal(res.body, 'message', 'successfully updated');
         } catch(err){
           console.log(err)
           return done(err);
         } 
           done();
          
        });
      });
      
    });
    
    suite('GET /api/issues/{project} => Array of objects with issue data', function() {
// I can GET /api/issues/{projectname} for an array of all issues on that specific project with all the 
// information for each issue as was returned when posted.
// I can filter my get request by also passing along any field and value in the query(ie. /api/issues/{project}?open=false).
// I can pass along as many fields/values as I want.
// All 11 functional tests are complete and passing.
      
      test('No filter', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({})
        .end(function(err, res){
        try{
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
         } catch(err){
           console.log(err)
           return done(err);
         } 
           done();
        });
      });
      
      test('One filter', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({ assigned_to: 'Chai and Mocha PUT' })
        .end(function(err, res){
          try{
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            assert.property(res.body[0], 'issue_title');
            assert.property(res.body[0], 'issue_text');
            assert.property(res.body[0], 'created_on');
            assert.property(res.body[0], 'updated_on');
            assert.property(res.body[0], 'created_by');
            assert.propertyVal(res.body[0], 'assigned_to','Chai and Mocha PUT');
            assert.property(res.body[0], 'open');
            assert.property(res.body[0], 'status_text');
            assert.property(res.body[0], '_id');
          } catch(err){
           console.log(err)
           return done(err);
         } 
           done();
        });        
      });
      
      test('Multiple filters (test for multiple fields you know will be in the db for a return)', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({ assigned_to: 'Chai and Mocha PUT' , created_by: 'Functional Test PUT - Every field filled in' })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.propertyVal(res.body[0], 'created_by', 'Functional Test PUT - Every field filled in' );
          assert.propertyVal(res.body[0], 'assigned_to','Chai and Mocha PUT');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
        });        
      });
      
    });
    
    suite('DELETE /api/issues/{project} => text', function() {
// I can DELETE /api/issues/{projectname} with a _id to completely delete an issue. 
// If no _id is sent return '_id error', success: 'deleted '+_id, failed: 'could not delete '+_id.
      
      test('No _id', function(done) {
        chai.request(server)
        .delete('/api/issues/test')
        .send({ })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.propertyVal(res.body, 'message', '_id error');
          done();
        });    
      });
      
      test('Valid _id', function(done) {
        chai.request(server)
        .delete('/api/issues/test')
        .send({ _id: id })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.propertyVal(res.body, 'message',  'deleted '+ id ) ;
          done();
        });        
      });

      test('Missing _id', function(done) {
        let fakeID=new ObjectID();
        chai.request(server)
        .delete('/api/issues/test')
        .send({ _id: fakeID })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.propertyVal(res.body, 'message', 'could not delete '+ fakeID) ;
          done();
        });        
      });
    });

});

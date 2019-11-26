/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *       (if additional are added, keep them at the very end!)
 */

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  const threadIds = { toDelete: {}, toUpdate: {}, toAddReplies: {} };
  const replyIds = { toDelete: {}, toUpdate: {} };

  suite('API ROUTING FOR /api/threads/:board', function() {
    suite('POST', function() {
      test('Test POST a new thread to /api/threads/test ', function(done) {
        this.timeout(6000);
        chai
          .request(server)
          .post('/api/threads/test')
          .send({
            text: 'TEST Thread Title 01',
            delete_password: 'test'
          })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            done();
          });
      }),
        test('Test POST a second thread to /api/threads/test ', function(done) {
          this.timeout(6000);
          chai
            .request(server)
            .post('/api/threads/test')
            .send({
              text: 'TEST Thread Title 02',
              delete_password: 'test'
            })
            .end(function(err, res) {
              assert.equal(res.status, 200);
              done();
            });
        }),
        test('Test POST a third thread to /api/threads/test ', function(done) {
          this.timeout(6000);
          chai
            .request(server)
            .post('/api/threads/test')
            .send({
              text: 'TEST Thread Title 03',
              delete_password: 'test'
            })
            .end(function(err, res) {
              assert.equal(res.status, 200);
              done();
            });
        });
    });

    suite('GET', function() {
      test('Test GET 10 most recent threads with max 3 replies from /api/threads/test', function(done) {
        this.timeout(6000);
        chai
          .request(server)
          .get('/api/threads/test')
          .end(function(err, res) {
            threadIds.toUpdate = res.body[0]._id;
            threadIds.toAddReplies = res.body[1]._id;
            threadIds.toDelete = res.body[2]._id;

            assert.equal(res.status, 200);
            // console.log('res.body :', res.body);
            assert.isArray(res.body, 'Response should be an array');
            assert.isAtMost(
              res.body.length,
              10,
              'Response should contain at most 10 items'
            );
            assert.isArray(res.body[0].replies, 'Response should be an array');
            assert.isAtMost(
              res.body[0].replies,
              3,
              'Response should contain at most 3 items'
            );
            assert.property(res.body[0], '_id', 'Thread should have an _id');
            assert.property(
              res.body[0],
              'text',
              'Response should have the property text'
            );
            assert.property(
              res.body[0],
              'created_on',
              'Response should have the property created_on'
            );
            assert.property(
              res.body[0],
              'bumped_on',
              'Response should have the property bumped_on'
            );
            assert.property(
              res.body[0],
              'replycount',
              'Response should have the property replycount'
            );

            assert.notProperty(
              res.body[0],
              'reported',
              'Response should not have the property reported'
            );
            assert.notProperty(
              res.body[0],
              'delete_password',
              'Thread should not have delete_password property'
            );
            done();
          });
      });
    });

    suite('DELETE', function() {
      test('Test DELETE a thread with false password at /api/threads/test ', function(done) {
        this.timeout(6000);
        chai
          .request(server)
          .delete('/api/threads/test')
          .send({
            thread_id: threadIds.toDelete,
            delete_password: 'false'
          })
          .end(function(err, res) {
            assert.equal(res.status, 400);
            assert.equal(res.text, 'incorrect password');
            done();
          });
      }),
        test('Test DELETE a thread with correct password at /api/threads/test ', function(done) {
          this.timeout(6000);
          chai
            .request(server)
            .delete('/api/threads/test')
            .send({
              thread_id: threadIds.toDelete,
              delete_password: 'test'
            })
            .end(function(err, res) {
              assert.equal(res.status, 200);
              assert.equal(res.text, 'success');
              done();
            });
        });
    });

    suite('PUT', function() {
      test('Test UPDATE (Report) a thread at /api/threads/test ', function(done) {
        this.timeout(6000);
        chai
          .request(server)
          .put('/api/threads/test')
          .send({
            thread_id: threadIds.toUpdate
          })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'success');
            done();
          });
      });
    });
  });

  suite('API ROUTING FOR /api/replies/:board', function() {
    suite('POST', function() {
      test('Test POST a new reply to /api/replies/test ', function(done) {
        this.timeout(6000);
        chai
          .request(server)
          .post('/api/replies/test')
          .send({
            thread_id: threadIds.toAddReplies,
            text: 'TEST Reply Text 01',
            delete_password: 'test'
          })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            done();
          });
      }),
        test('Test POST a second reply to /api/replies/test ', function(done) {
          this.timeout(6000);
          chai
            .request(server)
            .post('/api/replies/test')
            .send({
              thread_id: threadIds.toAddReplies,
              text: 'TEST Reply Text 02',
              delete_password: 'test'
            })
            .end(function(err, res) {
              assert.equal(res.status, 200);
              done();
            });
        }),
        test('Test POST a third reply to /api/replies/test ', function(done) {
          this.timeout(6000);
          chai
            .request(server)
            .post('/api/replies/test')
            .send({
              thread_id: threadIds.toAddReplies,
              text: 'TEST Reply Text 03',
              delete_password: 'test'
            })
            .end(function(err, res) {
              assert.equal(res.status, 200);
              done();
            });
        }),
        test('Test POST a forth reply to /api/replies/test ', function(done) {
          this.timeout(6000);
          chai
            .request(server)
            .post('/api/replies/test')
            .send({
              thread_id: threadIds.toAddReplies,
              text: 'TEST Reply Text 04',
              delete_password: 'test'
            })
            .end(function(err, res) {
              assert.equal(res.status, 200);
              done();
            });
        });
    });

    suite('GET', function() {
      test('Test GET entire thread with all replies from /api/replies/test', function(done) {
        this.timeout(6000);
        chai
          .request(server)
          .get('/api/replies/test')
          .query({
            thread_id: threadIds.toAddReplies
          })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            replyIds.toDelete = res.body.replies[1]._id;
            replyIds.toUpdate = res.body.replies[2]._id;

            // console.log('res.body.replies :', res.body.replies);
            assert.isObject(res.body, 'Response should be an object');
            assert.isArray(res.body.replies, 'Response should be an array');
            assert.property(res.body, '_id', 'Thread should have an _id');
            assert.property(
              res.body,
              'text',
              'Response should have the property text'
            );
            assert.property(
              res.body.replies[0],
              '_id',
              'Thread should have an _id'
            );
            assert.property(
              res.body,
              'created_on',
              'Response should have the property created_on'
            );
            assert.property(
              res.body,
              'bumped_on',
              'Response should have the property bumped_on'
            );
            assert.notProperty(
              res.body,
              'reported',
              'Response should not have the property reported'
            );
            assert.notProperty(
              res.body,
              'delete_password',
              'Response should not have the property delete_password'
            );
            done();
          });
      });
    });

    suite('PUT', function() {
      test('Test UPDATE (Report) a reply at /api/replies/test ', function(done) {
        this.timeout(6000);
        chai
          .request(server)
          .put('/api/replies/test')
          .send({
            reply_id: replyIds.toUpdate
          })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'success');
            done();
          });
      });
    });

    suite('DELETE', function() {
      test('Test DELETE a reply with false password at /api/replies/test', function(done) {
        this.timeout(6000);
        chai
          .request(server)
          .delete('/api/replies/test')
          .send({
            reply_id: replyIds.toDelete,
            delete_password: 'false'
          })
          .end(function(err, res) {
            assert.equal(res.status, 400);
            assert.equal(res.text, 'incorrect password');
            done();
          });
      });
      test('Test DELETE a reply with correct password at /api/replies/test', function(done) {
        this.timeout(6000);
        chai
          .request(server)
          .delete('/api/replies/test')
          .send({
            reply_id: replyIds.toDelete,
            delete_password: 'test'
          })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'success');
            done();
          });
      });
    });
  });
});

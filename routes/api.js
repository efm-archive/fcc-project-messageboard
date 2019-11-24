/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

'use strict';

var expect = require('chai').expect;
const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_CONNECTION_STRING = process.env.DB;
//Example connection: MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {});

module.exports = function(app) {
  mongoose.connect(
    MONGODB_CONNECTION_STRING,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    },
    (err, db) => {
      if (err) {
        console.log('Database error: ' + err);
      } else {
        console.log('Successful database connection');
      }
    }
  );

  const Schema = mongoose.Schema;

  const replySchema = new Schema({
    text: { type: String },
    created_on: { type: Date, default: Date.now },
    delete_password: { type: String, required: true, select: false },
    reported: { type: Boolean, default: false, select: false }
  });

  const threadSchema = new Schema({
    text: { type: String, required: true },
    created_on: { type: Date, default: Date.now },
    bumped_on: { type: Date, default: Date.now },
    delete_password: { type: String, required: true, select: false },
    reported: { type: Boolean, default: false, select: false },
    replies: [replySchema]
  });

  const boardSchema = new Schema({
    name: { type: String, required: true },
    threads: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Thread'
      }
    ]
  });

  const Board = mongoose.model('Board', boardSchema);
  const Thread = mongoose.model('Thread', threadSchema);
  const Reply = mongoose.model('Reply', replySchema);

  const getBoard = async name => {
    // try to find a board with the given name
    const board = await Board.findOne({ name });
    // if there is no board
    if (!board) {
      //create a new board
      const newBoard = new Board({
        name
      });
      // console.log('no board found, so creating new board "' + name + '"');

      // save and return the new board
      return await newBoard.save();
    } else {
      // return the found board
      return board;
    }
  };

  app
    .route('/api/threads/:board')
    .post(async (req, res, next) => {
      // destructure the data from the req objects
      const { text, delete_password } = req.body;

      // get the board
      const board = await getBoard(req.params.board);

      // create a new Thread with the destrutured data
      const newThread = new Thread({
        text,
        delete_password
      });

      //save the new Thread
      const savedThread = await newThread.save();
      // console.log('savedThread :', savedThread);

      // add the thread to the threads array on the board
      board.threads.push(savedThread);

      //save the updated board
      await board.save();

      //respond with the saved thread for dev testing
      res.status(200).send(savedThread);

      // redirect to the corresponding board
      // res.status(302).redirect(`/b/${req.params.board}`);
    })
    .get(async (req, res, next) => {
      // get the board
      const board = await getBoard(req.params.board);

      // get the threads that are referenced in the board.threads array
      const threads = await Thread.find({ _id: { $in: board.threads } })
        // sort them by bumped_on date in desc order
        .sort({
          bumped_on: -1
        })
        //limit the results to 10
        .limit(10);
      // send the filtered threads to the client
      res.status(200).send(threads);
    })
    .delete(async (req, res, next) => {
      // destructure the data from the req.body
      const { delete_password, thread_id } = req.body;

      // get the thread with the passed in thread_id and select the delete_password field
      const thread = await Thread.findOne(
        { _id: thread_id },
        'delete_password',
        (err, doc) => {}
      );

      // if the passwords match
      if (delete_password === thread.delete_password) {
        // delete the thread
        await thread.deleteOne();
        // respond with status 200 and 'success'
        res.status(200).send('success');
      } else {
        // respond with status 400 and 'incorrect password'
        res.status(400).send('incorrect password');
      }
    });

  app
    .route('/api/replies/:board')
    .post(async (req, res, next) => {
      // destructure the data from the req objects
      const { text, delete_password, thread_id } = req.body;

      // get the thread
      const thread = await Thread.findOne({ _id: thread_id });

      // create a new reply from the destructured data
      const newReply = new Reply({
        text,
        delete_password
      });

      //save the new Reply
      const savedReply = await newReply.save();

      // add the reply to the replies array on the thread
      thread.replies.push(savedReply);

      // update the threads bumped_on value
      thread.bumped_on = savedReply.created_on;

      //save the updated thread
      await thread.save();

      res.status(200).send(thread);
      // redirect to the corresponding thread
      // res.status(302).redirect(`/b/${req.params.board}/${thread_id}`);
    })
    .get(async (req, res, next) => {
      // get the thread_id from the query
      const { thread_id } = req.query;

      // get the thread
      const thread = await Thread.findOne({ _id: thread_id });

      // get the threads replies
      const replies = await Reply.find({ _id: { $in: thread.replies } })
        // sort them by bumped_on date in desc order
        .sort({
          bumped_on: -1
        });
      // send the sorted replies to the client
      res.status(200).send(replies);
    });
};

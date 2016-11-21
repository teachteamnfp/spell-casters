const express = require('express');
const app = express();
const db = require('../models');
const bcrypt = require('bcrypt');
const spells = db.Spell;
const users = db.User;
const gamestats = db.GameStat;
const validate = require('./validations');
const format = require('./formater');

//DB call for Spells table
app.get('/spells', (req, res) => {
  spells.findAll()
  .then((data => {
    let boss_spells = {};
    let base_spells = {};

    data.forEach((dataSet) => {
      if (dataSet.dataValues.type === 'boss') {
        boss_spells[dataSet.dataValues.key_word] = {
          word: dataSet.dataValues.word,
          prompt: dataSet.dataValues.prompt,
          hint: dataSet.dataValues.hint,
        };
      } else {
        base_spells[dataSet.dataValues.key_word] = {
          word: dataSet.dataValues.word,
          prompt: dataSet.dataValues.prompt,
          hint: dataSet.dataValues.hint,
        };
      }
    });

    res.json({
      success: true,
      boss_spells,
      base_spells
    });
  }));
});

//login route
app.post('/login', validate.fieldsFilled, validate.userExists, (req,res) => {
  res.json({
    success: req.body.validUser.success,
    userid: req.body.validUser.userid,
    username: req.body.validUser.username
  })
});

//registration route
app.post('/register', validate.fieldsFilled, validate.newUser, (req, res) => {
  res.json({
    success: req.body.newUser.success,
    userid: req.body.newUser.userid,
    username: req.body.newUser.username,
  })
});

//Post game statistics
app.post('/post-stats', (req,res) => {
  users.findOne({
    where: {username: req.body.username}
  })
  .then((user) => {
    const misspelledWordsArr = req.body.misspelledWords.split(',');
    const timeElapsedArr = req.body.timeElapsed.split(',').map(time => {return parseInt(time)})
    gamestats.create({
      percentCompleted: parseFloat(req.body.percentCompleted),
      totalWordsCompleted: parseInt(req.body.totalWordsCompleted),
      misspelledWords: misspelledWordsArr,
      timeElapsed: timeElapsedArr,
      score: parseInt(req.body.score),
      UserId: user.dataValues.id
    })
    .then(_ => {
      res.json({
        success:true
      })
    })
  })
})

//Get all past game statics by username
app.get('/game-stats/:username',(req,res) => {
  users.findOne({
    where: {username: req.params.username}
  })
  .then((user) => {
    gamestats.findAll({
      where: { UserId: user.dataValues.id},
      order: '"createdAt" DESC',
    })
    .then((stats) => {
      let recentGames = [];
      if(stats.length > 20){
        stats.reverse();
        for(var x = 0; x<20; x++){
          recentGames.push(stats[x]);
        }
      }else{
        stats.reverse();
        recentGames.push(stats);
      }
      stats.forEach(stat => {
        stat.percentCompleted = parseFloat(stat.percentCompleted);
      })

      res.json({
        stats,
        recentGames,
      })
    })
  })
})

app.get('/leaderboard', format.listHighscores, format.orderHighscores, (req,res) => {
  res.json({
    highscores: req.orderedHighscores
  })
})
module.exports = app;
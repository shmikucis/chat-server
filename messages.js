// messages.js
const _ = require('lodash')
const log = require('./log')

module.exports = {
  list: [],
  bot: 'server',
  maxStringLength: 500,

  add: function(userId, text){
    text = _.trim(text)
    text = _.truncate(text, { length: this.maxStringLength })
    if(text === '') return false
    const message = {
      userId: userId,
      text: text,
      timestamp: Date.now(),
    }
    this.list.push(message)
    log.log(message)
    return true
  },

  addBot: function(text){
    const message = {
      userId: this.bot,
      text: text,
      timestamp: Date.now(),
    }
    this.list.push(message)
    log.log(message)
  },

  getLast: function() { return _.last(this.list) },

  getAll: function() { return this.list },
}
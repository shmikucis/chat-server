// users.js
const _ = require('lodash')
const messages = require('./messages')

module.exports = {
  list: [],
  maxStringLength: 25,

  add: function(userId){
    userId = _.trim(userId)
    userId = _.truncate(userId, { length: this.maxStringLength, omission: '' })

    if(!this.isValidName(userId)) return 'Failed to connect. Username should consist only from numbers and letters.'
    else if(this.isNameTaken(userId)) return 'Failed to connect. Nickname already taken.'
    else if(userId === '') return 'Failed to connect. Nickname is empty.'
    else if(userId === messages.bot) return 'Failed to connect. Nickname already taken.'

    this.list.push(userId)
    return true
  },

  getLastUser: function(){ return _.last(this.list) },

  remove: function(userId){
    _.pull(this.list, userId)
  },

  isValidName: function(userId){
    return /^[a-z0-9]+$/i.test(userId)
  },

  isNameTaken: function(userId){
    return _.includes(this.list, userId)
  },
}
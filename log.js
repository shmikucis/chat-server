// log.js
const _ = require('lodash')

module.exports = {
  doLog: true, // comment out to disable logs

  log: function(obj){
    if(!this.doLog) return false

    // simple string
    if(_.isString(obj)){
      console.log(`${this.getDateTime()} ${obj}`)
    }
    // message object
    else if(_.isObject(obj) && obj.userId && obj.text && obj.timestamp){
      console.log(`${this.getDateTime(obj.timestamp)} ${obj.userId} wrote message: ${obj.text}`)
    }
    // unknown
    else {
      console.log('unknown log type: ', JSON.stringify(obj))
    }
  },

  getDateTime: function(unixTimestamp) { 
    if(!unixTimestamp) unixTimestamp = Date.now()
    return new Date(unixTimestamp).toUTCString() 
  },
}
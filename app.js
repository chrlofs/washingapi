var express = require('express')
var request = require('request')
var cheerio = require('cheerio')
var app = express()

var router = express.Router()

var username = ''
var pass = ''
var url = 'http://129.241.124.32:80/LaundryState'

router.get('/api', function (req, res) {
  console.log("Got a new request")
  request.get(url, {
    'auth' : {
      'user' : username,
      'pass' : pass,
      'sendImmediatly' : true
    }
  } ,function(err, response, html) {
      if(!err && response.statusCode == 200) {
        var $ = cheerio.load(html)

        var data = {
          availableMachines : 0,
          busyMachines : 0,
          totalMachines : 0
        }

        $('.tb').children().children().children().children().children().each(function(i, ele) {
          if($(ele).attr('bgcolor')) {
            if($(ele).attr('bgcolor') === 'Green') {
              data.availableMachines++
              data.totalMachines++
            } else {
              data.busyMachines++
              data.totalMachines++
            }
          }
        })
        res.send(data)
      } else {
        res.send("Something went wrong")
      }
  })
})

app.use(router)

app.listen(3000, function() {
  console.log('Listening on port 3000!')
})

var express = require('express')
var request = require('request')
var cheerio = require('cheerio')
var apicache = require('apicache').options({debug:true}).middleware
var app = express()

var router = express.Router()

var url = 'http://129.241.124.32:80/LaundryState'

router.get('/washingapi', apicache('5 minutes'), function (req, res) {
  console.log("Got a new request")

  var user = req.param('user')
  var password = req.param('pass')

  if (user == '' || password == '') {
    res.json({error: "Username or password not entered"})
  }

  request.get(url, {
    'auth' : {
      'user' : user,
      'pass' : password,
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
        res.header("Content-Type", "application/json")
        res.json(data)
      } else {
        res.json({error: "Something went wrong"})
      }
  })
})

app.use(router)

app.listen(3000, function() {
  console.log('Listening on port 3000!')
})

const clientMapController = require('./controllers/client-map.controller')

module.exports = [{
  method: 'GET',
  url: '',
  handler: clientMapController.get
}]
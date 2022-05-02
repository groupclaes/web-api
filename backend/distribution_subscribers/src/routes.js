const subscribers = require('./controllers/subscribers.controller')

module.exports = routes = [
  {
    method: 'GET',
    url: '',
    handler: subscribers.get
  }, {
    method: 'GET',
    url: '/:id',
    handler: subscribers.get
  }, {
    method: 'POST',
    url: '',
    handler: subscribers.post
  }, {
    method: 'PUT',
    url: '/:id',
    handler: subscribers.put
  }, {
    method: 'DELETE',
    url: '/:id',
    handler: subscribers.delete
  }
]
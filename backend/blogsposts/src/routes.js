// Import controllers
const blogpostsController = require('./controllers/blogspostsController')

module.exports = routes = [{
  method: 'GET',
  url: '',
  handler: blogpostsController.get
}, {
  method: 'GET',
  url: '/:id',
  handler: blogpostsController.get
}]
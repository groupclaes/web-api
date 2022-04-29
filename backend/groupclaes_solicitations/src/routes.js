const solicitationsController = require('./controllers/solicitations.controller')

module.exports = [{
  method: 'POST',
  url: '',
  handler: solicitationsController.post
}, {
  method: 'POST',
  url: '/file',
  handler: solicitationsController.postFile
}]
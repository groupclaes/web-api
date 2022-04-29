const vacanciesController = require('./controllers/vacancies.controller')

module.exports = [{
  method: 'GET',
  url: '',
  handler: vacanciesController.get
}]
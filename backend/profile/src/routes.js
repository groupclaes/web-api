const profileController = require('./controllers/profile.controller')
const birthdaysController = require('./controllers/profile-birthday.controller')

exports.routes = [{
  method: 'GET',
  url: '',
  handler: profileController.get,
  requiredPermissions: ['read:GroupClaes.Login']
}, {
  method: 'GET',
  url: '/team',
  handler: profileController.getTeam,
  requiredPermissions: ['read:GroupClaes.Login']
}, {
  method: 'GET',
  url: '/:user_id',
  handler: profileController.get,
  requiredPermissions: ['read:GroupClaes.Login']
}, {
  method: 'GET',
  url: '/avatar/:hash',
  handler: profileController.getAvatar
}, {
  method: 'GET',
  url: '/birthdays/upcomming',
  handler: birthdaysController.getUpcomming,
  requiredPermissions: ['read:GroupClaes.Login']
}]
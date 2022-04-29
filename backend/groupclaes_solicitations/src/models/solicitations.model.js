const sql = require('mssql')
const fs = require('fs')
const db = require('../db')
const config = require('../config')

const nodemailer = require('nodemailer')

exports.getVacancyName = async (id) => {
  const request = new sql.Request(await db.get('sapphire'))
  const result = await request.query(`SELECT * FROM vacancies WHERE active = 1 AND id = ${id}`)

  if (result.recordset.length > 0) {
    const vacancy = result.recordset[0]
    let data = vacancy.data.toString('utf-8')
    const startString = 'RAW_API.Controllers.Claes._LanguageEntry[]'

    if (data.indexOf(startString) > -1) {
      data = data.substring((data.indexOf(startString) + startString.length))
      data = data.split('RAW_API.Controllers.Claes._LanguageEntry')

      let title = data[1]
        .replace('\x02\x00\x00\x00\x02nl\x02fr\x01\x01\x02\x00\x00\x00\x06\x06\x00\x00\x00', '')
        .replace('\x07\x05\x00\x00\x00\x00\x01\x00\x00\x00\x01\x00\x00\x00\x04(', '')
        .replace('\x06\x07\x00\x00\x00', '&%&')

      title = title.split('&%&')
      const titleNl = new RegExp(/^(([^a-z])|(\\[a-z]{1})|(\\x[0-9A-Z]{2}))((\s|\S)*)/g)
        .exec(title[0])[5]

      const titleFr = new RegExp(/^(([^a-z])|(\\[a-z]{1})|(\\x[0-9A-Z]{2}))((\s|\S)*)/g)
        .exec(title[1])[5]

      return {
        title: {
          nl: titleNl,
          fr: titleFr
        }
      }
    } else {
      const { title } = JSON.parse(data)
      return title
    }
  }
  return null
}

exports.getMailTemplate = (templateName, culture) => fs.readFileSync(`${config.dataPath}html_templates/${templateName}_${culture}.html`, 'utf8').toString()

exports.sendMail = async (to, subject, html, attachments = []) => {
  try {
    let transporter = nodemailer.createTransport(config.smtp)
    let info = await transporter.sendMail({
      from: '"Claes Distribution" <administrator@claes-distribution.com>',
      to,
      subject,
      html,
      attachments: attachments.map(e => ({   // stream as an attachment
        filename: 'attachment.pdf',
        content: fs.createReadStream(e)
      }))
    })

    if (info) {
      return info.messageId
    }
  } catch (err) {
    throw err
  }
}
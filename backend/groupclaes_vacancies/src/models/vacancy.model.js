const sql = require('mssql')
const db = require('../db')

// implements indexOf(startString) to allow smooth transition to json in feature
exports.get = async () => {
  const request = new sql.Request(await db.get('sapphire'))
  const result = await request.query(`SELECT * FROM vacancies WHERE active = 1`);

  if (result.recordset.length > 0) {
    const vacancies = result.recordset

    return vacancies.map(function (vacancy) {
      let data = vacancy.data.toString('utf-8')
      const startString = 'RAW_API.Controllers.Claes._LanguageEntry[]'

      if (data.indexOf(startString) > -1) {
        data = data.substring((data.indexOf(startString) + startString.length))
        data = data.split('RAW_API.Controllers.Claes._LanguageEntry')

        const company = data[0]
          .replace('\x02\x00\x00\x00\x02\x00\x00\x00\t\x03\x00\x00\x00\x06\x04\x00\x00\x00\x03', '')
          .replace('\t\x05\x00\x00\x00\x05\x03\x00\x00\x00(', '')

        let title = data[1]
          .replace('\x02\x00\x00\x00\x02nl\x02fr\x01\x01\x02\x00\x00\x00\x06\x06\x00\x00\x00', '')
          .replace('\x07\x05\x00\x00\x00\x00\x01\x00\x00\x00\x01\x00\x00\x00\x04(', '')
          .replace('\x06\x07\x00\x00\x00', '&%&')

        title = title.split('&%&')
        const titleNl = new RegExp(/^(([^a-z])|(\\[a-z]{1})|(\\x[0-9A-Z]{2}))((\s|\S)*)/g)
          .exec(title[0])[5]

        const titleFr = new RegExp(/^(([^a-z])|(\\[a-z]{1})|(\\x[0-9A-Z]{2}))((\s|\S)*)/g)
          .exec(title[1])[5]

        let body = data[2].replace('\x02\x00\x00\x00\t\b\x00\x00\x00\x01\b\x00\x00\x00\x03\x00\x00\x00\x06\t\x00\x00\x00', '')
          .replace('\x00\x00\x00', '&%&')
          .replace('\x0B', '')

        body = body.split('&%&')
        const bodyNl = new RegExp(/^(([^a-z])|(\\[a-z]{1})|(\\x[0-9A-Z]{2}))([^A-Za-z])?((\s|\S)*)/g)
          .exec(body[0])[6]

        const bodyFr = new RegExp(/^(([^a-z])|(\\[a-z]{1})|(\\x[0-9A-Z]{2}))([^A-Za-z])?((\s|\S)*)/g)
          .exec(body[1])[6]

        return {
          id: vacancy.id,
          title: {
            nl: titleNl,
            fr: titleFr
          },
          company,
          descriptions: [{
            nl: bodyNl,
            fr: bodyFr
          }]
        }
      } else {
        const { title, company, descriptions } = JSON.parse(data)

        return {
          id: vacancy.id,
          title,
          company,
          descriptions
        }
      }
    })
  }
  return []
}

factory = (item) => {
  let data = item.data.toString('utf-8')
  const startString = 'RAW_API.Controllers.Claes._LanguageEntry[]'

  if (data.indexOf(startString) > -1) {
    data = data.substring((data.indexOf(startString) + startString.length))
    data = data.split('RAW_API.Controllers.Claes._LanguageEntry')

    const company = data[0]
      .replace('\x02\x00\x00\x00\x02\x00\x00\x00\t\x03\x00\x00\x00\x06\x04\x00\x00\x00\x03', '')
      .replace('\t\x05\x00\x00\x00\x05\x03\x00\x00\x00(', '')

    let title = data[1]
      .replace('\x02\x00\x00\x00\x02nl\x02fr\x01\x01\x02\x00\x00\x00\x06\x06\x00\x00\x00', '')
      .replace('\x07\x05\x00\x00\x00\x00\x01\x00\x00\x00\x01\x00\x00\x00\x04(', '')
      .replace('\x06\x07\x00\x00\x00', '&%&')

    title = title.split('&%&')
    const titleNl = new RegExp(/^(([^a-z])|(\\[a-z]{1})|(\\x[0-9A-Z]{2}))((\s|\S)*)/g)
      .exec(title[0])[5]

    const titleFr = new RegExp(/^(([^a-z])|(\\[a-z]{1})|(\\x[0-9A-Z]{2}))((\s|\S)*)/g)
      .exec(title[1])[5]

    let body = data[2].replace('\x02\x00\x00\x00\t\b\x00\x00\x00\x01\b\x00\x00\x00\x03\x00\x00\x00\x06\t\x00\x00\x00', '')
      .replace('\x00\x00\x00', '&%&')
      .replace('\x0B', '')

    body = body.split('&%&')
    const bodyNl = new RegExp(/^(([^a-z])|(\\[a-z]{1})|(\\x[0-9A-Z]{2}))([^A-Za-z])?((\s|\S)*)/g)
      .exec(body[0])[6]

    const bodyFr = new RegExp(/^(([^a-z])|(\\[a-z]{1})|(\\x[0-9A-Z]{2}))([^A-Za-z])?((\s|\S)*)/g)
      .exec(body[1])[6]

    return {
      id: item.id,
      title: {
        nl: titleNl,
        fr: titleFr
      },
      company,
      descriptions: [{
        nl: bodyNl,
        fr: bodyFr
      }]
    }
  }

  const { title, company, descriptions } = JSON.parse(data)

  return {
    id: item.id,
    title,
    company,
    descriptions
  }
}
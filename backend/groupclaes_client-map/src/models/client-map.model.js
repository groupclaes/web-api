const fs = require('fs')
const config = require('../config')
const { validatePath } = require('../helper')

/**
 * Get client map
 * @param {string} company name of the company
 * @param {boolean} old get old values instead of live
 */
exports.get = (company, old) => {
  let _fn = resolveFileName(company, old)

  if (_fn === null) {
    throw new Error('No file name specified! Please specify company name.')
  } else {
    _fn = config.dataPath + _fn
  }

  _fn = validatePath(data.filename, config.dataPath)

  try {
    // Check if the file exists
    fs.accessSync(_fn, fs.constants.R_OK)
    // Read the file
    const content = fs.readFileSync(_fn, 'ucs2').toString()

    const result = content.replace(/"/gi, '').trim().split(/\r?\n/).map(line => {
      const items = line.split(';')
      if (items.length >= 12) {
        return {
          custNum: parseInt(items[0], 10),
          custName: items[1],
          streetName: items[2],
          num: items[3],
          countryCode: items[4],
          zipCode: items[5],
          cityName: items[6],
          custType: items[7],
          salesRep: parseInt(items[8], 10),
          routeCode: items[9],
          position: {
            lat: parseFloat(items[10].replace(',', '.')),
            lng: parseFloat(items[11].replace(',', '.'))
          }
        }
      } else {
        // skip line
      }
    })

    return result
  } catch (err) {
    console.error(err)
    throw new Error('File does not exist or is not readable!', err)
  }
}

const resolveFileName = (company, old) => {
  switch (company) {
    case 'GRO':
      return old ? 'client-map-csv-YY-11-18_08-41-11.old' : `client-map-${company}.csv`
    case 'MAC':
      return `client-map-${company}.csv`
    default:
      return null
  }
}
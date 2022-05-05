const sql = require('mssql')
const db = require('../db')

exports.totalLogins = () => {
  return new Promise(async function (resolve, reject) {
    try {
      const request = new sql.Request(await db.get('Company'))
      const result = await request.query(`SELECT TOP(1) logins FROM stats`)

      if (result.recordset.length > 0) {
        const stat = result.recordset[0]

        resolve({
          position: 0,
          name: "totalUserLogins",
          cssClass: "grey",
          lowValue: null,
          highValue: null,
          currentValue: stat.logins.toString(),
          previousValue: null,
          maximumValue: "∞",
          displayMode: "cpm",
          percentage: 0,
          positive: false,
          history: null
        })
      } else {
        resolve(null)
      }
    } catch (err) {
      reject(err)
    }
  })
}

exports.totalEshopUsers = () => {
  return new Promise(async function (resolve, reject) {
    try {
      const request = new sql.Request(await db.get('Distribution'))
      const result = await request.query(`SELECT COUNT(*) as count FROM Users WHERE Active = 1 AND CustomerId > 1000 AND UserType = 1`);

      if (result.recordset.length > 0) {
        const stat = result.recordset[0]

        resolve({
          position: 20,
          name: "totalEshopUsers",
          cssClass: "grey",
          lowValue: null,
          highValue: null,
          currentValue: stat.count.toString(),
          previousValue: null,
          maximumValue: "∞",
          displayMode: "cpm",
          percentage: 0,
          positive: false,
          history: null
        })
      } else {
        resolve(null)
      }
    } catch (err) {
      reject(err)
    }
  })
}

exports.totalActiveEshopUsers = () => {
  return new Promise(async function (resolve, reject) {
    try {
      const request = new sql.Request(await db.get('Distribution'))
      const result = await request.query(`SELECT COUNT(*) as count FROM Users WHERE Active = 1 AND CustomerId > 1000 AND UserType = 1 AND LastLogonDate > (getdate() - 365)`);

      if (result.recordset.length > 0) {
        const stat = result.recordset[0]
        console.log(result)

        resolve({
          position: 30,
          name: "totalActiveEshopUsers",
          cssClass: "green",
          lowValue: null,
          highValue: null,
          currentValue: stat.count.toString(),
          previousValue: null,
          maximumValue: "∞",
          displayMode: "cpm",
          percentage: 0,
          positive: false,
          history: null
        })
      } else {
        resolve(null)
      }
    } catch (err) {
      reject(err)
    }
  })
}

exports.totalActiveEshopUsersToday = () => {
  return new Promise(async function (resolve, reject) {
    try {
      const request = new sql.Request(await db.get('Distribution'))
      const result = await request.query(`DECLARE @today DATE = CAST(GETDATE() AS date)
        DECLARE @yesterday DATE = CAST((GETDATE() - 1) AS date)
        DECLARE @temp TABLE (count INT)

        INSERT INTO @temp
        SELECT COUNT(DISTINCT [Statistics].Id)
        FROM [Statistics]
        INNER JOIN Users ON Users.Id = [Statistics].userId
        WHERE Users.Active = 1 AND Users.CustomerId > 1000 AND Users.UserType = 1 AND date > @today
        GROUP BY Users.Id
        DECLARE @usersToday INT = @@ROWCOUNT

        INSERT INTO @temp
        SELECT COUNT(DISTINCT [Statistics].Id)
        FROM [Statistics]
        INNER JOIN Users ON Users.Id = [Statistics].userId
        WHERE Users.Active = 1 AND Users.CustomerId > 1000 AND Users.UserType = 1 AND date > @yesterday AND date <= @today
        GROUP BY Users.Id
        DECLARE @usersYesterday INT = @@ROWCOUNT

        SELECT [yesterday] = @usersYesterday,
          [today] = @usersToday`)

      if (result.recordset.length > 0) {
        const statN = {
          count: result.recordset[0].today
        }
        const statY = {
          count: result.recordset[0].yesterday
        }

        let positive = false
        let percentage = 0

        if (statY.count > statN.count) {
          percentage = 100 - ((statN.count) / (statY.count)) * 100
        } else {
          percentage = ((statN.count - statY.count) / (statY.count == 0 ? 1 : statY.count)) * 100
          positive = true
        }

        resolve({
          position: 35,
          name: "totalActiveEshopUsersToday",
          cssClass: (statN.count >= statY.count) ? "green" : "red",
          lowValue: null,
          highValue: null,
          currentValue: statN.count.toString(),
          previousValue: statY.count.toString(),
          maximumValue: null,
          displayMode: "ppm",
          percentage: percentage,
          positive: positive,
          history: null
        })
      } else {
        resolve(null)
      }
    } catch (err) {
      reject(err)
    }
  })
}

exports.totalEshopRegistrationsToday = () => {
  return new Promise(async function (resolve, reject) {
    try {
      const request = new sql.Request(await db.get('Distribution'))

      const result = await Promise.all([
        request.query(`SELECT COUNT(*) as count
            FROM Users
            WHERE Users.Active = 1 AND Users.CustomerId > 1000 AND Users.UserType = 1 AND RegistrationDate > CAST(GETDATE() AS date)`),
        request.query(`SELECT COUNT(*) as count
            FROM Users
            WHERE Users.Active = 1 AND Users.CustomerId > 1000 AND Users.UserType = 1 AND RegistrationDate > DATEADD(day, -1, CAST(GETDATE() AS date)) AND RegistrationDate <= CAST(GETDATE() AS date)`)
      ])

      if (result[0].recordset.length > 0) {
        const statN = result[0].recordset[0]
        const statY = result[1].recordset[0]
        let positive = false
        let percentage = 0

        if (statY.count > statN.count) {
          percentage = 100 - ((statN.count) / (statY.count)) * 100
        } else {
          percentage = ((statN.count - statY.count) / (statY.count == 0 ? 1 : statY.count)) * 100
          positive = true
        }

        resolve({
          position: 40,
          name: "totalEshopRegistrationsToday",
          cssClass: (statN.count >= statY.count) ? "green" : "red",
          lowValue: null,
          highValue: null,
          currentValue: statN.count.toString(),
          previousValue: statY.count.toString(),
          maximumValue: null,
          displayMode: "ppm",
          percentage: percentage,
          positive: positive,
          history: null
        })
      } else {
        resolve(null)
      }
    } catch (err) {
      reject(err)
    }
  })
}

exports.eshopMostViewedProductToday = () => {
  return new Promise(async function (resolve, reject) {
    try {
      const request = new sql.Request(await db.get('Distribution'))

      const result = await Promise.all([
        request.query(`SELECT TOP(1) ProductId
            FROM [Statistics]
            WHERE ProductId IS NOT NULL AND actionId = 1 AND date > CAST(GETDATE() AS date)
            GROUP BY ProductId
            ORDER BY COUNT(ProductId) DESC`),
        request.query(`SELECT TOP(1) ProductId
            FROM [Statistics]
            WHERE ProductId IS NOT NULL AND actionId = 1 AND date > DATEADD(day, -1, CAST(GETDATE() AS date)) AND date <= CAST(GETDATE() AS date)
            GROUP BY ProductId
            ORDER BY COUNT(ProductId) DESC`)
      ])

      if (result[0].recordset.length > 0) {
        const statN = result[0].recordset[0]
        const statY = result[1].recordset[0]

        resolve({
          position: 50,
          name: "eshopMostViewedProductToday",
          cssClass: "green",
          lowValue: null,
          highValue: null,
          currentValue: statN.ProductId.toString(),
          previousValue: statY.ProductId.toString(),
          maximumValue: null,
          displayMode: "ppm",
          percentage: 0,
          positive: false,
          history: null
        })
      } else {
        resolve(null)
      }
    } catch (err) {
      reject(err)
    }
  })
}

exports.eshopMostViewedProductThisWeek = () => {
  return new Promise(async function (resolve, reject) {
    try {
      const request = new sql.Request(await db.get('Distribution'))

      const result = await Promise.all([
        request.query(`SELECT TOP(1) ProductId
            FROM [Statistics]
            WHERE ProductId IS NOT NULL AND actionId = 1 AND date > DATEADD(day, -7, CAST(GETDATE() AS date))
            GROUP BY ProductId
            ORDER BY COUNT(ProductId) DESC`),
        request.query(`SELECT TOP(1) ProductId
            FROM [Statistics]
            WHERE ProductId IS NOT NULL AND actionId = 1 AND date > DATEADD(day, -14, CAST(GETDATE() AS date)) AND date <= DATEADD(day, -7, CAST(GETDATE() AS date))
            GROUP BY ProductId
            ORDER BY COUNT(ProductId) DESC`)
      ])

      if (result[0].recordset.length > 0) {
        const statN = result[0].recordset[0]
        const statY = result[1].recordset[0]

        resolve({
          position: 55,
          name: "eshopMostViewedProductThisWeek",
          cssClass: "green",
          lowValue: null,
          highValue: null,
          currentValue: statN.ProductId.toString(),
          previousValue: statY.ProductId.toString(),
          maximumValue: null,
          displayMode: "ppm",
          percentage: 0,
          positive: false,
          history: null
        })
      } else {
        resolve(null)
      }
    } catch (err) {
      reject(err)
    }
  })
}
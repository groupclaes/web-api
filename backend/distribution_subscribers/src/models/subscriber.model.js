const sql = require('mssql')
const crypto = require('crypto')
const nodemailer = require('nodemailer')
const config = require('../config')
const db = require('../db')

/**
 * 
 * @param {string} email 
 * @returns {Promise<any>}
 */
exports.get = async (email) => {
  try {
    const request = new sql.Request(await db.get('distribution'))

    if (email) {
      request.input('email', email)
      const result = await request.query(`SELECT * FROM subscribers WHERE (SELECT sys.fn_varbintohexsubstring(0, HashBytes('SHA1', [subscribers].[email]), 1, 0))=@email`)

      if (result.recordset.length > 0) {
        return {
          subscriber: result.recordset[0]
        }
      } else {
        throw new Error('Email not found!')
      }
    } else {
      const result = await request.query(`SELECT * FROM subscribers`)

      return {
        subscribers: result.recordset
      }
    }
  } catch (err) {
    throw err
  }
}

exports.post = async (subscriber, culture) => {
  try {
    const request = new sql.Request(await db.get('distribution'))
    request.input('email', subscriber.email)
    request.input('culture', culture)
    const response = await request.query(`EXEC AddSubscriber @email, @culture`)
    const { error, result } = response.recordset[0]

    if (error) {
      throw error
    } else if (result === 'ok') {
      sendWelcomeMail(subscriber.email, culture)
        .then(async (r) => {
          request.input('messageId', r)
          await request.query(`UPDATE subscribers SET confirmationMailSent=1, welcomeMessageId=@messageId, modifiedOn=getdate() WHERE email=@email`)
        })
        .catch(console.error)
      return result
    } else {
      throw new Error('idk-lol')
    }
  } catch (err) {
    throw err
  }
}

exports.put = async (email, subscriber) => {
  try {
    const request = new sql.Request(await db.get('distribution'))
    request.input('email', email)
    request.input('personalName', subscriber.personalName)
    request.input('personalSurname', subscriber.personalSurname)
    request.input('personalCompany', subscriber.personalCompany)
    request.input('personalPhone', subscriber.personalPhone)
    request.input('optInOn', subscriber.optInOn)
    request.input('optInMethod', subscriber.optInMethod)
    request.input('optInTerms', subscriber.optInTerms)
    request.input('acceptedOptInTerms', subscriber.acceptedOptInTerms)
    request.input('confirmationMailSent', subscriber.confirmationMailSent)
    request.input('reminderMailSent', subscriber.reminderMailSent)
    const result = await request.query(`
        BEGIN
          UPDATE subscribers
          SET personalName=CASE
              WHEN @personalName IS NULL THEN personalName
              ELSE @personalName
            END,personalSurname=CASE
              WHEN @personalSurname IS NULL THEN personalSurname
              ELSE @personalSurname
            END,personalCompany=CASE
              WHEN @personalCompany IS NULL THEN personalCompany
              ELSE @personalCompany
            END,personalPhone=CASE
              WHEN @personalPhone IS NULL THEN personalPhone
              ELSE @personalPhone
            END,optInOn=CASE
              WHEN @optInOn IS NULL THEN optInOn
              ELSE @optInOn
            END,optInMethod=CASE
              WHEN @optInMethod IS NULL THEN optInMethod
              ELSE @optInMethod
            END,optInTerms=CASE
              WHEN @optInTerms IS NULL THEN optInTerms
              ELSE @optInTerms
            END,acceptedOptInTerms=CASE
              WHEN @acceptedOptInTerms IS NULL THEN acceptedOptInTerms
              ELSE @acceptedOptInTerms
            END,confirmationMailSent=CASE
              WHEN @confirmationMailSent IS NULL THEN confirmationMailSent
              ELSE @confirmationMailSent
            END,reminderMailSent=CASE
              WHEN @reminderMailSent IS NULL THEN reminderMailSent
              ELSE @reminderMailSent
            END,modifiedOn=getdate()
          WHERE (SELECT sys.fn_varbintohexsubstring(0, HashBytes('SHA1', [subscribers].[email]), 1, 0))=@email
        END`)


    if (result.rowsAffected.length > 0 && result.rowsAffected[0] > 0) {
      return result
    }
    return null
  } catch (err) {
    throw err
  }
}

exports.delete = async (email) => {
  try {
    const request = new sql.Request(await db.get('distribution'))
    request.input('email', email)
    const result = await request.query(`
        DELETE FROM subscribers
        WHERE (SELECT sys.fn_varbintohexsubstring(0, HashBytes('SHA1', [subscribers].[email]), 1, 0))=@email`)

    if (result.rowsAffected.length > 0 && result.rowsAffected[0] > 0) {
      return result.rowsAffected[0] > 0
    }
    return null
  } catch (err) {
    throw err
  }
}

/**
 * Check if the input email address is valid
 * @param {string} email to test
 * @returns {boolean} `true` if valid email address
 */
exports.validateEmail = (email) => {
  const r = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return r.test(email)
}

sendWelcomeMail = (email, culture) => {
  return new Promise(async function (resolve, reject) {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport(config.smtp)

    // retrieve html from fs in desiredLanguage
    if (culture) {
      culture = culture.split('-')[0]
      culture = (culture === 'nl' || culture === 'fr') ? culture : 'nl'
    } else {
      culture = 'nl'
    }

    let button = `<table width="100%" border="0" cellspacing="0" cellpadding="0"><tr><td bgcolor="#ffffff" align="center" style="padding:30px 30px 40px"><table border="0" cellspacing="0" cellpadding="0"><tr><td align="center" style="border-radius:3px;" bgcolor="#40ab86"><a href="@Button.Url" target="_blank" style="font-size:20px;font-family:Helvetica,Arial,sans-serif;color:#ffffff;text-decoration:none;color:#ffffff;text-decoration:none;padding:15px 25px;border-radius:2px;border:1px solid #24704C;display:inline-block;">@Button.Text</a></td></tr></table></td></tr></table>`

    // https://www.willpeavy.com/tools/minifier
    data = {
      nl: `<!DOCTYPE html><html><head><title></title><meta http-equiv="Content-Type" content="text/html; charset=utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"><meta http-equiv="X-UA-Compatible" content="IE=edge"/><style type="text/css"> @import url('https://fonts.googleapis.com/css?family=Nunito'); /* CLIENT-SPECIFIC STYLES */ body, table, td, a{-webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;}table, td{mso-table-lspace: 0pt; mso-table-rspace: 0pt;}img{-ms-interpolation-mode: bicubic;}/* RESET STYLES */ img{border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none;}table{border-collapse: collapse !important;}body{height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important;}/* iOS BLUE LINKS */ a[x-apple-data-detectors]{color: inherit !important; text-decoration: none !important; font-size: inherit !important; font-family: inherit !important; font-weight: inherit !important; line-height: inherit !important;}/* MOBILE STYLES */ @media screen and (max-width:600px){h1{font-size: 32px !important; line-height: 32px !important;}}/* ANDROID CENTER FIX */ div[style*="margin: 16px 0;"]{margin: 0 !important;}</style></head><body style="background-color: #f4f5f7; margin: 0 !important; padding: 0 !important;"><div style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: 'Nunito', Helvetica, Arial, sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;"> @RenderHeader() </div><table border="0" cellpadding="0" cellspacing="0" width="100%"><tr><td bgcolor="#75a78e" align="center"><!--[if (gte mso 9)|(IE)]><table align="center" border="0" cellspacing="0" cellpadding="0" width="600"><tr><td align="center" valign="top" width="600"><![endif]--><table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"><tr><td align="center" valign="top" style="padding: 40px 10px 40px 10px;"><a href="https://claes-distribution.be" target="_blank"><img alt="Logo" src="https://pcm.groupclaes.be/v3/content/file/691289a1-0cda-4034-8d86-6c2bc454455a" height="120" style="display:block;max-height:120px;font-family:'Nunito',Helvetica,Arial,sans-serif;color:#ffffff;font-size:18px;" border="0"></a></td></tr></table><!--[if (gte mso 9)|(IE)]></td></tr></table><![endif]--></td></tr><tr><td bgcolor="#75a78e" align="center" style="padding: 0px 10px 0px 10px;"><!--[if (gte mso 9)|(IE)]><table align="center" border="0" cellspacing="0" cellpadding="0" width="600"><tr><td align="center" valign="top" width="600"><![endif]--><table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"><tr><td bgcolor="#ffffff" align="center" valign="top" style="padding:40px 20px 20px 20px;border-radius:4px 4px 0px 0px;color:#111111;font-family:'Nunito',Helvetica,Arial,sans-serif;font-size: 48px;font-weight:400;line-height:48px;"><h1 style="font-size:48px;font-weight:400;margin:0 0 30px"> @RenderTitle() </h1></td></tr></table><!--[if (gte mso 9)|(IE)]></td></tr></table><![endif]--></td></tr><tr><td bgcolor="#f4f5f7" align="center" style="padding: 0px 10px 0px 10px;"><!--[if (gte mso 9)|(IE)]><table align="center" border="0" cellspacing="0" cellpadding="0" width="600"><tr><td align="center" valign="top" width="600"><![endif]--><table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"><tr><td bgcolor="#ffffff" align="left" style="padding:20px 30px 40px 30px;color:#666666;font-family:'Nunito',Helvetica,Arial,sans-serif;font-size:18px;font-weight:400;line-height:25px;"> @RenderBody() </td></tr></table><!--[if (gte mso 9)|(IE)]></td></tr></table><![endif]--></td></tr><tr><td bgcolor="#f4f5f7" align="center" style="padding: 0px 10px 0px 10px;"><!--[if (gte mso 9)|(IE)]><table align="center" border="0" cellspacing="0" cellpadding="0" width="600"><tr><td align="center" valign="top" width="600"><![endif]--><table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"><tr><td bgcolor="#f4f5f7" align="left" style="padding: 30px 30px 30px 30px; color: #666666; font-family: 'Nunito', Helvetica, Arial, sans-serif; font-size: 14px; font-weight: 400; line-height: 18px;"><p style="margin: 0;"> Dit bericht is onderworpen aan de voorwaarden beschikbaar op <a href="https://www.claes-distribution.be/legal/email-disclaimer/nl" target="_blank">onze website.</a></p></td></tr><!-- <tr><td bgcolor="#f4f5f7" align="left" style="padding: 0px 30px 30px 30px; color: #666666; font-family: 'Nunito', Helvetica, Arial, sans-serif; font-size: 14px; font-weight: 400; line-height: 18px;"><p style="margin: 0;"> Problemen of vragen?<br>Bel ons op <nobr><a class="tel" href="tel:003211456200" style="color:#666666;text-decoration:none;"><span style="white-space: nowrap">011 45 62 00</span></a></nobr> of e-mail <nobr><a href="mailto:info@claes-distribution.be" style="color:#666666;text-decoration:underline;">info@claes-distribution.be</a></nobr></p></td></tr>--><tr><td bgcolor="#f4f5f7" align="left" style="padding: 0px 30px 30px 30px;color:#666666;font-family:'Nunito',Helvetica,Arial,sans-serif;font-size:14px;font-weight:400;line-height: 18px;"><p style="margin: 0;">&copy; Claes Distribution - Beverlosesteenweg 128 - 3583 Paal-Beringen, België</p></td></tr></table><!--[if (gte mso 9)|(IE)]></td></tr></table><![endif]--></td></tr></table></body></html>`,
      fr: `<!DOCTYPE html><html><head><title></title><meta http-equiv="Content-Type" content="text/html; charset=utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"><meta http-equiv="X-UA-Compatible" content="IE=edge"/><style type="text/css"> @import url('https://fonts.googleapis.com/css?family=Nunito'); /* CLIENT-SPECIFIC STYLES */ body, table, td, a{-webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;}table, td{mso-table-lspace: 0pt; mso-table-rspace: 0pt;}img{-ms-interpolation-mode: bicubic;}/* RESET STYLES */ img{border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none;}table{border-collapse: collapse !important;}body{height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important;}/* iOS BLUE LINKS */ a[x-apple-data-detectors]{color: inherit !important; text-decoration: none !important; font-size: inherit !important; font-family: inherit !important; font-weight: inherit !important; line-height: inherit !important;}/* MOBILE STYLES */ @media screen and (max-width:600px){h1{font-size: 32px !important; line-height: 32px !important;}}/* ANDROID CENTER FIX */ div[style*="margin: 16px 0;"]{margin: 0 !important;}</style></head><body style="background-color: #f4f5f7; margin: 0 !important; padding: 0 !important;"><div style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: 'Nunito', Helvetica, Arial, sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;"> @RenderHeader() </div><table border="0" cellpadding="0" cellspacing="0" width="100%"><tr><td bgcolor="#75a78e" align="center"><!--[if (gte mso 9)|(IE)]><table align="center" border="0" cellspacing="0" cellpadding="0" width="600"><tr><td align="center" valign="top" width="600"><![endif]--><table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"><tr><td align="center" valign="top" style="padding: 40px 10px 40px 10px;"><a href="https://claes-distribution.be" target="_blank"><img alt="Logo" src="https://pcm.groupclaes.be/v3/content/file/691289a1-0cda-4034-8d86-6c2bc454455a" height="120" style="display:block;max-height:120px;font-family:'Nunito',Helvetica,Arial,sans-serif;color:#ffffff;font-size:18px;" border="0"></a></td></tr></table><!--[if (gte mso 9)|(IE)]></td></tr></table><![endif]--></td></tr><tr><td bgcolor="#75a78e" align="center" style="padding: 0px 10px 0px 10px;"><!--[if (gte mso 9)|(IE)]><table align="center" border="0" cellspacing="0" cellpadding="0" width="600"><tr><td align="center" valign="top" width="600"><![endif]--><table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"><tr><td bgcolor="#ffffff" align="center" valign="top" style="padding:40px 20px 20px 20px;border-radius:4px 4px 0px 0px;color:#111111;font-family:'Nunito',Helvetica,Arial,sans-serif;font-size: 48px;font-weight:400;line-height:48px;"><h1 style="font-size:48px;font-weight:400;margin:0 0 30px"> @RenderTitle() </h1></td></tr></table><!--[if (gte mso 9)|(IE)]></td></tr></table><![endif]--></td></tr><tr><td bgcolor="#f4f5f7" align="center" style="padding: 0px 10px 0px 10px;"><!--[if (gte mso 9)|(IE)]><table align="center" border="0" cellspacing="0" cellpadding="0" width="600"><tr><td align="center" valign="top" width="600"><![endif]--><table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"><tr><td bgcolor="#ffffff" align="left" style="padding: 20px 30px 40px 30px; color: #666666; font-family: 'Nunito', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;"> @RenderBody() </td></tr></table><!--[if (gte mso 9)|(IE)]></td></tr></table><![endif]--></td></tr><tr><td bgcolor="#f4f5f7" align="center" style="padding: 0px 10px 0px 10px;"><!--[if (gte mso 9)|(IE)]><table align="center" border="0" cellspacing="0" cellpadding="0" width="600"><tr><td align="center" valign="top" width="600"><![endif]--><table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"><tr><td bgcolor="#f4f5f7" align="left" style="padding: 30px 30px 30px 30px; color: #666666; font-family: 'Nunito', Helvetica, Arial, sans-serif; font-size: 14px; font-weight: 400; line-height: 18px;"><p style="margin: 0;"> Ce message est soumis aux conditions disponibles sur <a href="https://www.claes-distribution.be/legal/email-disclaimer/fr" target="_blank">notre site web.</a></p></td></tr><!-- <tr><td bgcolor="#f4f5f7" align="left" style="padding: 0px 30px 30px 30px; color: #666666; font-family: 'Nunito', Helvetica, Arial, sans-serif; font-size: 14px; font-weight: 400; line-height: 18px;"><p style="margin: 0;"> Des problèmes ou des questions?<br>Appelez-nous <nobr><a class="tel" href="tel:0011456200" style="color:#666666;text-decoration:none;" target="_blank"><span style="white-space: nowrap">011 45 62 00</span></a></nobr> ou e-mai <nobr><a href="mailto:info@claes-distribution.be" style="color:#666666;text-decoration:underline;" target="_blank">info@claes-distribution.be</a></nobr></p></td></tr>--><tr><td bgcolor="#f4f5f7" align="left" style="padding: 0px 30px 30px 30px; color: #666666; font-family: 'Nunito', Helvetica, Arial, sans-serif; font-size: 14px; font-weight: 400; line-height: 18px;"><p style="margin: 0;">&copy; Claes Distribution - Beverlosesteenweg 128 - 3583 Paal-Beringen, Belgique</p></td></tr></table><!--[if (gte mso 9)|(IE)]></td></tr></table><![endif]--></td></tr></table></body></html>`
    }

    let html = data[culture]
    let subject = '<SUBJECT>'
    let text = '<TEXT>'

    const emailHash = crypto.createHash('sha1').update(email).digest('hex')
    button = button.replace(
      '@Button.Url',
      `https://www.claes-distribution.be/verify-subscribe/${emailHash}`
    )

    if (culture === 'nl') {
      subject = 'Bijna klaar: bevestig je inschrijving'
      text = `Bedankt voor je interesse in onze nieuwsbrieven!\n\nOm je inschrijving helemaal volgens de regels van de kunst af te ronden, moet je alleen nog even bevestigen. Nadien ontvang je 1 tot maximaal 2 keer per maand een mailtje van ons.`

      html = html.replace('@RenderTitle()', 'Bevestig je inschrijving')
      const body = `Bedankt voor je interesse in onze nieuwsbrieven!<br><br>Om je inschrijving helemaal volgens de regels van de kunst af te ronden, moet je alleen nog even bevestigen. Nadien ontvang je 1 tot maximaal 2 keer per maand een mailtje van ons. `
      button = button.replace('@Button.Text', 'Bevestig je inschrijving')
      const footer = `Als je vragen hebt of om welke reden dan ook hulp nodig hebt, neem dan contact op met ons via <a href="mailto:info@claes-distribution.be" style="color:#40ab86;text-decoration:underline;">info@claes-distribution.be</a>.<br><br>Met vriendelijke groeten<br>Team Claes Distribution`
      html = html.replace('@RenderHeader()', 'Bijna klaar: bevestig je inschrijving ✔')
      html = html.replace('@RenderBody()', body + button + footer)
    } else {
      subject = `Presque terminé : confirmez votre inscription`
      text = `Merci de l'intérêt que vous portez à nos bulletins d’information !\n\nPour finaliser votre inscription selon les règles de l'art, il vous suffit de confirmer. Ensuite, vous recevrez un e-mail de notre part 1 à 2 fois par mois au maximum.`

      html = html.replace('@RenderTitle()', 'Confirmez votre inscription')
      const body = `Merci de l'intérêt que vous portez à nos bulletins d’information !<br><br>Pour finaliser votre inscription selon les règles de l'art, il vous suffit de confirmer. Ensuite, vous recevrez un e-mail de notre part 1 à 2 fois par mois au maximum.`
      button = button.replace('@Button.Text', 'Confirmez votre inscription')
      const footer = `Si vous avez des questions ou si vous avez besoin d'aide pour une raison quelconque, veuillez nous contacter à l'adresse <a href="mailto:info@claes-distribution.be" style="color:#40ab86;text-decoration:underline;">info@claes-distribution.be</a>.<br><br>Bien à vous,<br>L'équipe de Claes Distribution`
      html = html.replace('@RenderHeader()', 'Presque terminé : confirmez votre inscription ✔')
      html = html.replace('@RenderBody()', body + button + footer)
    }

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"Frans - Claes Distribution" <marketing@claes-distribution.be>',
      to: email,
      subject,
      text,
      html
    }).catch(function (err) {
      reject(err.responseCode)
    })

    if (info) {
      resolve(info.messageId)
    }
  })
}
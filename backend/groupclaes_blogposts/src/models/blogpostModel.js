const sql = require('mssql')
const db = require('../db')
const pcm = require('../providers/pcm')

exports.get = async (id, params) => {
  try {
    const request = new sql.Request(await db.get('sapphire'))

    if (id) {
      console.log(params)
      request.input('id', sql.Int, id)
      request.input('token', sql.UniqueIdentifier, params.token)
      const result = await request.execute('GetBlogPost')
      const { error, verified } = result.recordset[0]

      if (error) {
        return { error, verified }
      } else if (result && result.recordsets.length > 0) {
        const resp = {
          error,
          verified,
          result: result.recordsets.length > 1 ? result.recordsets[1][0] : [],
          extra_results: result.recordsets.length > 2 ? result.recordsets[2][0] : []
        }
        await addMeta(resp)
        return resp
      }
      return reply
        .code(500)
        .send()
    }

    request.input('page', sql.Int, params.page)
    request.input('itemCount', sql.Int, params.itemCount)
    request.input('company', sql.VarChar, params.company)
    request.input('type', sql.TinyInt, params.type)

    const result = await request.query(`EXEC GetBlogPosts @page, @itemCount, @company, @type`)
    return {
      error: result.recordset[0].e,
      verified: result.recordset[0].v,
      result: result.recordsets.length > 1 ? result.recordsets[1][0] : []
    }
  } catch (err) {
    throw err
  }
}

const addMeta = async (blogposts) => {
  if (blogposts.verified) {
    // get meta info for all blogposts
    for (let i = 0; i < blogposts.result.length; i++) {
      await factory(blogposts.result[i])
    }
    // get meta info for all extra results
    for (let i = 0; i < blogposts.extra_results.length; i++) {
      await factory(blogposts.extra_results[i])
    }
  }
}

const factory = async (blogpost) => {
  if (!blogpost.image)
    return

  /** @type {string} */
  const image = blogpost.image.replace('https://pcm.groupclaes.be/v3/i/', '')
    .replace('https://pcm.groupclaes.be/v3/content/', '')
  const params = image.split('/')
  if (params.length >= 4) {
    const metas = await pcm.getMetaInformation(params[0], params[1], params[2], params[3].replace('?', ''))
    if (metas && metas.length > 0)
      blogpost.meta = metas[0]
  }
}
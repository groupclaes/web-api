const sql = require('mssql')
const db = require('../db')

exports.get = async (user_id) => {
  try {
    const request = new sql.Request(await db.get('sapphire'))
    request.input('user_id', sql.Int, user_id)
    const result = await request.query(`EXEC GetProfile @user_id`)

    const { error, verified } = result.recordset[0]
    if (verified) {
      return {
        error,
        verified,
        profile: result.recordsets[1][0]
      }
    }
    throw new Error(error)
  } catch (err) {
    throw err
  }
}

exports.getAvatar = async (hash) => {
  try {
    const request = new sql.Request(await db.get('sapphire'))
    request.input('hash', sql.VarChar, hash)
    const result = await request.query(`EXEC GetProfileAvatar @hash`)

    if (result.recordset.length > 0) {
      return result.recordset[0].avatar
    } else {
      return Buffer.from('iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAACTFBMVEUAAABYsOBhiKBhiqJncHlncnxncXpcncFle4tncXtpcXlocHhleYhYsOBYsOBYsOBYsOBYsOBYsOBYsOBYsOBYsOBYsOBYsOBYseFZrNpaqNRYseJQ0/9fk7Fih55P1f9paGxncHlncHlpZ2tncnxncXpncHpUXGZOVWBmb3hsd4FhaXNLUVy5vcDqmIrpf2zOzM1WW2ZVXWhrdX9YsOBYseJYsuJYsOFYseFYrdxUl71Qgp9QgJxTkbRXqtdWp9RMboVHSlFGQ0hGQ0dGR01KYnNUnsdXr99bgZdiXFlGRElDQUdEQkhbVVRfdoJWqtdTocyPkYro0663qJGYjX2VinutoIrizquvpJBTlLhTl76zqZX/7MD/68D/6b//6sD/7MHTwaJYi6lcm76/s5v/6L7/6r/cyKdlk6pXsOGQtbzcx6Tp062kta1bsuBWr+GLvs724rn95rqpx8VXsOBbsd+0zsz/6b7T2cZltNxWr+B0udrs4sL757+Rw9RVr+G1zsr/6Lz/6b3R1sJgs99SoMycrqz13K/747j85Lr23K+xtadUmsJaqtZclLVHXG6SlZr57dju16js1KP05suxsbJHVWVbjKlap9FfkrBle4tibHVESlWEiJD+///75tX53MX///+kp61CSFReZm9meIZgjKdncnxnb3hkbXZRWWN1eoL19PXwoZTth3b68/GRlZxNVWBia3RncHhncHllbndMU19eY23b3t/oq6HokoPm5uZHTllja3ROVF/Hys3ppZnpi3vY2NkAAADWNK7uAAAANHRSTlMAAAAAAAAAAAAAAAAAHW+96vwHX88Oj/hf+PhfB4+PBw6Q+Q4HYM/8/NAecL7r/f3rvnAeMmZrWQAAAAFiS0dEAIgFHUgAAAAHdElNRQflChkJDCPs/yXUAAABd0lEQVQY02NgYAQCXj5+AUFBAX4+XhCPASQmJCwiaGJqZmZmLigiLAQSZWQUFRM3sbC0sraxtbMwERcTBQkKiZmYWNg7ODo5u7i6WZiYiAkBBYXFTUzcPTy9vL19fP38zU3EhRkZeEWACgMCg4JDQsPCIyJNTUxEeBn4BE1MTKOiY2Lj4uITEpOAgoJ8DPwmQMHklPhUIEhLzwAKmvAzCADJzKzsOJBgXE5uHpArwADUbZJfUJgKBkXFJUCuIFjQpLQMLFZeUQkRBGk3qaquAQnW1tWbgLWDLAI6qqExNbWpuQWkEGgRyEnmpq1t7R2dXd095hZgJwEdb97b1z9h4qTJU6ZOmz7DxBzoeEYJyZmzZs+ZO2/+goWLFi9ZukxKGuh3GdnlK1auWr1m7br1GzZu2rxFTh4oyKSgqLR12/YdO3ftXr1nr5KiMjNQkIVVRVVNfd/+AwcPbdfQVFVhY2NnYODg5OTS0tbR1dM3MDQy5uZk42EAAO3RbL141crWAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDIxLTEwLTI1VDA5OjEyOjIxKzAwOjAwdgp9eQAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyMS0xMC0yNVQwOToxMjoyMSswMDowMAdXxcUAAAAASUVORK5CYII=', 'base64')
    }
  } catch (err) {
    throw err
  }
}

exports.getTeam = async (user_id) => {
  try {
    const request = new sql.Request(await db.get('sapphire'))
    request.input('user_id', sql.Int, user_id)
    const result = await request.query(`EXEC GetTeamMembers @user_id`)

    const { error, verified } = result.recordset[0]
    if (verified) {
      return {
        error,
        verified,
        members: result.recordsets[1]
      }
    }
    throw new Error(error)
  } catch (err) {
    throw err
  }
}
'use strict'

// External dependencies
const { FastifyRequest, FastifyReply } = require('fastify')
const { JwtPayload } = require('jsonwebtoken')

const Analytics = require('../models/analytics.model')

/**
 * Get 
 * @route GET /dashboard
 * @param {FastifyRequest} request
 * @param {FastifyReply} reply
 */
exports.getDashboard = async (request, reply) => {
  try {
    /** @type {JwtPayload} */
    const token = request.token
    
    return Analytics.getDashboard(token.sub)
  } catch (err) {
    throw err
  }
}
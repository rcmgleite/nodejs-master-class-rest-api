/*
 * This file contains all configuration parameters needed by the API.
 * All possible parameters try to get their value from env variables.
 * If the corresponding env variables are not set, a default value is set
 */

module.exports = {
  serverConfig: {
    httpPort: process.env.HTTP_PORT || 3000,
    httpsPort: process.env.HTTPS_PORT || 3001,
  }
}

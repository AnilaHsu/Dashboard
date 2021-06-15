let baseURL
if (process.env.NODE_ENV === 'production')
  baseURL = "http://59.120.19.161:7321"
else
  baseURL = "http://59.120.19.161:7321"

export { baseURL }
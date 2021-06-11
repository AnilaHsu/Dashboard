let baseURL
if (process.env.NODE_ENV === 'production')
  baseURL = "http://localhost:7321"
else
  baseURL = "https://api.wasay.cc"

export { baseURL }
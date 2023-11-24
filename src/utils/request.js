import axios from 'axios'

const instance = axios.create({
  baseURL: import.meta.env.VITE_APP_WEB_URL, // Replace with your API base URL
  timeout: 5000, // Set a timeout for requests
  headers: {
    'Content-Type': 'application/json',
    // You can add more headers here if needed
  },
})

// Request interceptor
instance.interceptors.request.use(
  config => {
    // You can modify the request config here (e.g., add headers)
    // config.headers['Authorization'] = 'Bearer ' + getToken();
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// Response interceptor
instance.interceptors.response.use(
  response => {
    console.log('response in request.js', response)
    // You can modify the response data here
    return response.data
  },
  error => {
    // You can handle errors here
    return Promise.reject(error)
  }
)

export default function request(options) {
  return instance(options)
    .then(response => {
      return response
    })
    .catch(error => {
      // Handle errors globally here
      console.error('Request error:', error)
      throw error
    })
}

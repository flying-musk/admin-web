import axios from 'axios'

export function getFormattedAddress(zipCode) {
  const country = zipCode && zipCode.length === 5 ? 'US' : 'CA'
  const options = {
    url: 'https://maps.googleapis.com/maps/api/geocode/json',
    method: 'get',
    params: {
      components: `country:${country}|postal_code:${zipCode}`,
      language: 'en',
      key: 'AIzaSyDNlJlDq62R3gBmABo3EeOKM4xPy3mIv1I'
    }
  }

  return axios.default(options)
}

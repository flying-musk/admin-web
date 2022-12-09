import {
    getFormattedAddress
  } from '@/api/address'
  
  const member = {
    state: {
      formattedAddress: '',
      formattedAddress2: '',
      noAddress: false,
      noAddress2: false,
      postcode: [],
      postcodeRec: [],
      county: '',
      countyRec: ''
    },
    getters: {
      formattedAddress: state => state.formattedAddress,
      hasAddress: state => state.noAddress,
      formattedAddress2: state => state.formattedAddress2,
      hasAddress2: state => state.noAddress2,
      postcodeOptions: state => state.postcode,
      postcodeRecOptions: state => state.postcodeRec
    },
    mutations: {
      SET_FORMATTED_ADDRESS: (state, formattedAddress) => {
        state.formattedAddress = formattedAddress
      },
      SET_NO_ADDRESS: (state, status) => {
        state.noAddress = status
      },
      SET_FORMATTED_ADDRESS2: (state, formattedAddress2) => {
        state.formattedAddress2 = formattedAddress2
      },
      SET_NO_ADDRESS2: (state, status) => {
        state.noAddress2 = status
      },
      SET_POST_CODE: (state, list) => {
        state.postcode = list
      },
      SET_COUNTY_CITY: (state, add) => {
        state.county = add;
      },
      SET_POST_CODE_REC: (state, list) => {
        state.postcodeRec = list
      },
      SET_COUNTY_CITY_REC: (state, add) => {
        state.countyRec = add;
      }
    },
    actions: {
      getFormattedAddress({ commit }, zipCode) {
        return new Promise((resolve, reject) => {
          getFormattedAddress(zipCode)
            .then(response => {
              const { data } = response
              commit('SET_POST_CODE', [])
              commit('SET_COUNTY_CITY', '')
              if (data.status === 'OK') {
                commit('SET_NO_ADDRESS', false)
                commit('SET_FORMATTED_ADDRESS', '')
                const cmp = data.results[0].address_components
                if (['US', 'CA'].includes(cmp[cmp.length - 1].short_name)) {
                  if (data.results[0].postcode_localities && data.results[0].postcode_localities.length > 0) {
                    const locality = data.results[0].address_components[1].long_name
                    const localities = data.results[0].postcode_localities
                    if (localities.indexOf(locality) === -1) {
                      localities.push(locality)
                    }
                    commit('SET_POST_CODE', localities)
                    const add = data.results[0].formatted_address.split(',')
                    add.splice(0, 1)
                    commit('SET_COUNTY_CITY', add.join(','))
                  } else {
                    commit('SET_FORMATTED_ADDRESS', data.results[0].formatted_address)
                  }
                  resolve()
                } else {
                  commit('SET_FORMATTED_ADDRESS', '')
                  resolve(cmp[cmp.length - 1].short_name)
                }
              } else {
                commit('SET_FORMATTED_ADDRESS', '')
                commit('SET_NO_ADDRESS', true)
                resolve(data.status)
              }
            }).catch(error => {
              commit('SET_FORMATTED_ADDRESS', '')
              reject(error)
            })
        })
      },
      getFormattedAddress2({ commit }, zipCode2) {
        return new Promise((resolve, reject) => {
          getFormattedAddress(zipCode2)
            .then(response => {
              commit('SET_POST_CODE_REC', [])
              commit('SET_COUNTY_CITY_REC', '')
              const { data } = response
              if (data.status === 'OK') {
                commit('SET_NO_ADDRESS2', false)
                commit('SET_FORMATTED_ADDRESS2', '')
                const cmp = data.results[0].address_components
                if (['US', 'CA'].includes(cmp[cmp.length - 1].short_name)) {
                  if (data.results[0].postcode_localities && data.results[0].postcode_localities.length > 0) {
                    const locality = data.results[0].address_components[1].long_name
                    const localities = data.results[0].postcode_localities
                    if (localities.indexOf(locality) === -1) {
                      localities.push(locality)
                    }
                    commit('SET_POST_CODE_REC', localities)
                    const add = data.results[0].formatted_address.split(',')
                    add.splice(0, 1)
                    commit('SET_COUNTY_CITY_REC', add.join(','))
                  } else {
                    commit('SET_FORMATTED_ADDRESS2', data.results[0].formatted_address)
                  }
                  resolve()
                } else {
                  commit('SET_FORMATTED_ADDRESS2', '')
                  resolve(cmp[cmp.length - 1].short_name)
                }
              } else {
                commit('SET_FORMATTED_ADDRESS2', '')
                commit('SET_NO_ADDRESS2', true)
                resolve(data.status)
              }
            }).catch(error => {
              commit('SET_FORMATTED_ADDRESS2', '')
              reject(error)
            })
        })
      }
    }
  }
  
  export default member
  
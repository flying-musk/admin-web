export const getItem = name => {
  const data = window.localStorage.getItem(name)
  try {
    return JSON.parse(data)
  } catch (err) {
    return data
  }
}

export const setItem = (name, value) => {
  if (typeof value === 'object') {
    value = JSON.stringify(value)
  }

  window.localStorage.setItem(name, value)
}

export const removeItem = name => {
  window.localStorage.removeItem(name)
}


export const getSessionItem = name => {
  const data = window.sessionStorage.getItem(name)
  try {
    return JSON.parse(data)
  } catch (err) {
    return data
  }
}

export const setSessionItem = (name, value) => {
  if (typeof value === 'object') {
    value = JSON.stringify(value)
  }

  window.sessionStorage.setItem(name, value)
}

export const removeSessionItem = name => {
  window.sessionStorage.removeItem(name)
}

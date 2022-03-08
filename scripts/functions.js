// Resets input values
const resetInput = (elements) => {
  elements.forEach(element => element.value = '')
}

// Removes custom elements like expiration date
const removeCustomArea = (element) => {
  element.innerHTML = ''
}

// Renders custom elements for cookie
const renderCookieElements = () => {
  const labelForExpiration = document.createElement('label')
  labelForExpiration.textContent = 'Expiration date: '
  labelForExpiration.setAttribute('for', 'expiration')
  expDateArea.appendChild(labelForExpiration)

  const expiration = document.createElement('input')
  expiration.setAttribute('type', 'date')
  expiration.setAttribute('id', 'expiration')
  expDateArea.appendChild(expiration)
}

const renderData = (data, element) => {
  if (data === null) {
    element.textContent = `Couldn't find the data`
  } else {
    element.textContent = data
  }
}

const addCookie = () => {
  const expirationDate = document.querySelector('#expiration').value
  const expirationDateArray = expirationDate.split('-')
  // via js-cookie library
  Cookies.set(addKey.value, value.value, {
    expires: new Date(expirationDateArray[0], expirationDateArray[1] - 1, expirationDateArray[2], 3)
  })
}
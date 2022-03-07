const addKey = document.querySelector('#add-key')
const deleteKey = document.querySelector('#delete-key')
const value = document.querySelector('#value')
const storages = document.querySelector('#storages')
const btnAdd = document.querySelector('#btn-add')
const btnDelete = document.querySelector('#btn-delete')
const span = document.querySelector('#custom-element-area')

storages.value = 'local-storage'

storages.addEventListener('change', () => {
  renderDefaults()

  if (storages.value === 'cookie-storage') {
    renderCookieElements()
  }
})

btnAdd.addEventListener('click', () => {
  if (addKey.value === '' || value.value === '') return

  if (storages.value === 'local-storage') {
    localStorage.setItem(addKey.value, value.value)
  } else if (storages.value === 'session-storage') {
    sessionStorage.setItem(addKey.value, value.value)
  } else if (storages.value === 'cookie-storage') {
    addCookie()
  }

  resetInput()
})

btnDelete.addEventListener('click', () => {
  if (storages.value === 'local-storage') {
    localStorage.removeItem(deleteKey.value)
  } else if (storages.value === 'session-storage') {
    sessionStorage.removeItem(deleteKey.value)
  } else if (storages.value === 'cookie-storage') {
    removeCookie()
  }

  resetInput()
})

const resetInput = () => {
  addKey.value = ''
  value.value = ''
  deleteKey.value = ''
}

// Removes custom elements
const renderDefaults = () => {
  span.innerHTML = ''
}

// Renders custom elements for cookie
const renderCookieElements = () => {
  const labelForExpiration = document.createElement('label')
  labelForExpiration.textContent = 'Expiration date: '
  labelForExpiration.setAttribute('for', 'expiration')
  span.appendChild(labelForExpiration)

  const expiration = document.createElement('input')
  expiration.setAttribute('type', 'date')
  expiration.setAttribute('id', 'expiration')
  span.appendChild(expiration)
}

const addCookie = () => {
  const expirationDate = document.querySelector('#expiration').value
  const expirationDateArray = expirationDate.split('-')
  // via js-cookie library
  Cookies.set(addKey.value, value.value, {
    expires: new Date(expirationDateArray[0], expirationDateArray[1] - 1, expirationDateArray[2], 3)
  })
}

const removeCookie = () => {
  // via js-cookie library
  Cookies.remove(deleteKey.value)
}
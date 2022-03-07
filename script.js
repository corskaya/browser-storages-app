const key = document.querySelector('#key')
const value = document.querySelector('#value')
const storages = document.querySelector('#storages')
const btnAdd = document.querySelector('#btn-add')
const span = document.querySelector('#expire-input')

storages.value = 'local-storage'

storages.addEventListener('change', () => {
  renderDefaults()

  if (storages.value === 'cookie-storage') {
    renderCookieElements()
  }
})

btnAdd.addEventListener('click', () => {
  const storagesValue = storages.value
  const keyValue = key.value
  const valueValue = value.value

  if (keyValue === '' || valueValue === '') return

  if (storagesValue === 'local-storage') {
    localStorage.setItem(keyValue, valueValue)
  } else if (storagesValue === 'session-storage') {
    sessionStorage.setItem(keyValue, valueValue)
  } else if (storagesValue === 'cookie-storage') {
    addCookie()
  }

  resetInput()
})

const resetInput = () => {
  key.value = ''
  value.value = ''
}

const renderDefaults = () => {
  span.innerHTML = ''
}

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
  Cookies.set(key.value, value.value, {
    expires: new Date(expirationDateArray[0], expirationDateArray[1] - 1, expirationDateArray[2], 3)
  })
}
const addKey = document.querySelector('#add-key')
const value = document.querySelector('#value')
const addStorages = document.querySelector('#add-storages')
const btnAdd = document.querySelector('#btn-add')
const expDateArea = document.querySelector('#expiration-date-area')
const btnBack = document.querySelector('#btn-back')

addStorages.value = 'local-storage'

addStorages.addEventListener('change', () => {
  removeCustomArea(expDateArea)

  if (addStorages.value === 'cookie-storage') {
    renderCookieElements()
  }
})

btnAdd.addEventListener('click', () => {
  if (addKey.value === '' || value.value === '') return

  if (addStorages.value === 'local-storage') {
    localStorage.setItem(addKey.value, value.value)
  } else if (addStorages.value === 'session-storage') {
    sessionStorage.setItem(addKey.value, value.value)
  } else if (addStorages.value === 'cookie-storage') {
    addCookie()
  }

  resetInput([addKey, value])
})

btnBack.addEventListener('click', () => {
  location.assign('index.html')
})
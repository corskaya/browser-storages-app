const key = document.querySelector('#key')
const value = document.querySelector('#value')
const storages = document.querySelector('#storages')
const btnAdd = document.querySelector('#btn-add')

storages.value = 'local-storage'

const resetInput = () => {
  key.value = ''
  value.value = ''
}

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

  }

  resetInput()
})

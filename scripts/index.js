const btnAdd = document.getElementById('btn-add')
const btnDelete = document.getElementById('btn-delete')
const btnGet = document.getElementById('btn-get')

btnAdd.addEventListener('click', () => {
  location.assign('add-update.html')
})

btnDelete.addEventListener('click', () => {
  location.assign('delete.html')
})

btnGet.addEventListener('click', () => {
  location.assign('get.html')
})
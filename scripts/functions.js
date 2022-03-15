// Resets input values
const resetInput = (...elements) => {
  elements.forEach(element => element.value = '')
}

// Removes custom elements like expiration date
const removeCustomArea = (element) => {
  element.innerHTML = ''
}

// Cookies
// Renders custom elements for cookie
const renderCookieElements = () => {
  const expirationContainer = document.createElement('div')
  expirationContainer.classList.add('create-new-container')
  customAddArea.appendChild(expirationContainer)

  const labelForExpiration = document.createElement('label')
  labelForExpiration.textContent = 'Expiration Date:'
  labelForExpiration.setAttribute('for', 'expiration')
  labelForExpiration.setAttribute('id', 'expiration-label')
  expirationContainer.appendChild(labelForExpiration)

  const expiration = document.createElement('input')
  expiration.setAttribute('type', 'date')
  expiration.setAttribute('id', 'expiration')
  expiration.classList.add('key-value-input')
  expirationContainer.appendChild(expiration)
}

const renderData = (data, element) => {
  if (!data) {
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

const indexedDB = window.indexedDB || window.mozIndexedDB
let db = null
let selectedOS = null

// IndexedDB
const renderAddIDBElements = async () => {
  customAddArea.innerHTML = ''
  let currentDBContainer
  let currentDatabases

  const databases = await indexedDB.databases()

  if (databases.length === 0) {
    const noDBMessage = document.createElement('p')
    noDBMessage.textContent = 'No Database Exist'
    noDBMessage.classList.add('no-db-message')
    customAddArea.appendChild(noDBMessage)
  } else {
    currentDBContainer = document.createElement('div')
    currentDBContainer.classList.add('custom-select-container')
    customAddArea.appendChild(currentDBContainer)

    currentDatabases = document.createElement('select')
    currentDBContainer.appendChild(currentDatabases)

    const dbPlaceholderOption = document.createElement('option')
    dbPlaceholderOption.textContent = 'Database'
    dbPlaceholderOption.setAttribute('disabled', null)
    dbPlaceholderOption.setAttribute('selected', null)
    currentDatabases.appendChild(dbPlaceholderOption)

    databases.forEach(db => {
      const databaseOption = document.createElement('option')
      databaseOption.textContent = db.name
      databaseOption.setAttribute('value', db.name)
      currentDatabases.appendChild(databaseOption)
    })
  }

  const createNewDBContainer = document.createElement('div')
  createNewDBContainer.classList.add('create-new-container')
  customAddArea.appendChild(createNewDBContainer)

  const btnCreateNewDB = document.createElement('button')
  btnCreateNewDB.textContent = 'Create New Database'
  btnCreateNewDB.classList.add('btn')
  btnCreateNewDB.classList.add('create-new-btn')
  createNewDBContainer.appendChild(btnCreateNewDB)

  const objStoreContainer = document.createElement('div')
  customAddArea.appendChild(objStoreContainer)

  btnCreateNewDB.addEventListener('click', e => {
    createNewDBContainer.removeChild(e.target)

    const newDBName = document.createElement('input')
    newDBName.setAttribute('placeholder', 'DB Name')
    newDBName.classList.add('db-os-input')
    createNewDBContainer.appendChild(newDBName)

    const version = document.createElement('input')
    version.setAttribute('type', 'number')
    version.setAttribute('min', '0')
    version.setAttribute('placeholder', 'DB Version')
    version.classList.add('db-os-input')
    createNewDBContainer.appendChild(version)

    const createDB = document.createElement('button')
    createDB.textContent = 'Create'
    createDB.classList.add('btn')
    createDB.classList.add('btn-add')
    createNewDBContainer.appendChild(createDB)

    createDB.addEventListener('click', async () => {
      await createIDB(newDBName.value, version.value)
      await renderAddIDBElements()
    })
  })

  const renderAddOSElements = () => {
    objStoreContainer.innerHTML = ''
    let currentObjStores

    if (!db || db.objectStoreNames.length === 0) {
      const noOSMessage = document.createElement('p')
      noOSMessage.textContent = 'No Object Store Exist'
      noOSMessage.classList.add('no-db-message')
      objStoreContainer.appendChild(noOSMessage)
    } else {
      currentObjStores = document.createElement('select')
      objStoreContainer.appendChild(currentObjStores)

      const osPlaceholderOption = document.createElement('option')
      osPlaceholderOption.textContent = 'Object Store'
      osPlaceholderOption.setAttribute('disabled', null)
      osPlaceholderOption.setAttribute('selected', null)
      currentObjStores.appendChild(osPlaceholderOption)

      for (let i = 0; i < db.objectStoreNames.length; i++) {
        const objStoreOption = document.createElement('option')
        objStoreOption.textContent = db.objectStoreNames[i]
        objStoreOption.setAttribute('value', db.objectStoreNames[i])
        currentObjStores.appendChild(objStoreOption)
      }
    }

    const createNewOSContainer = document.createElement('div')
    createNewOSContainer.classList.add('create-new-container')
    objStoreContainer.appendChild(createNewOSContainer)

    const btnCreateNewOS = document.createElement('button')
    btnCreateNewOS.textContent = 'Create New Object Store'
    btnCreateNewOS.classList.add('btn')
    btnCreateNewOS.classList.add('create-new-btn')
    createNewOSContainer.appendChild(btnCreateNewOS)

    if (currentObjStores) {
      currentObjStores.addEventListener('change', e => {
        selectedOS = e.target.value
      })
    }

    btnCreateNewOS.addEventListener('click', e => {
      createNewOSContainer.removeChild(e.target)

      const newOSName = document.createElement('input')
      newOSName.setAttribute('placeholder', 'Object Store Name')
      newOSName.classList.add('db-os-input')
      createNewOSContainer.appendChild(newOSName)

      const createOS = document.createElement('button')
      createOS.textContent = 'Create'
      createOS.classList.add('btn')
      createOS.classList.add('btn-add')
      createNewOSContainer.appendChild(createOS)

      createOS.addEventListener('click', async () => {
        await createIDB(db.name, db.version + 1, newOSName.value)
        renderAddOSElements()
      })
    })
  }

  if (currentDatabases) {
    currentDatabases.addEventListener('change', async e => {
      const selectedDBNameForAdd = e.target.value
      const selectedDBVersion = databases.forEach(function (db) {
        if (db.name === selectedDBNameForAdd) {
          return db.version
        }
      })
      await createIDB(selectedDBNameForAdd, selectedDBVersion)
      renderAddOSElements()
    })
  }
}

const addIndexedDB = () => {
  createIDB(db.name, db.version, selectedOS, addKey.value, value.value)
}

const createIDB = (dbName, dbVersion, osName = null, key = null, value = null) => new Promise((resolve, reject) => {
  const request = indexedDB.open(dbName, dbVersion)

  request.onupgradeneeded = e => {
    db = e.target.result
    if (osName) {
      db.createObjectStore(osName)
    }
  }

  request.onsuccess = e => {
    db = e.target.result
    if (osName && key && value) {
      const transaction = db.transaction(osName, 'readwrite')
      const store = transaction.objectStore(osName)
      store.add(value, key)
    }
    resolve(e.target.result)
    db.close()
  }

  request.onerror = e => {
    reject(e.target.error)
  }
})

let selectedDBNameForDelete
let selectedDBVersionForDelete
let selectedOSNameForDelete

const renderDeleteIDBElements = async () => {
  customDeleteArea.innerHTML = ''

  const databases = await indexedDB.databases()

  if (databases.length === 0) {
    const noDBMessage = document.createElement('p')
    noDBMessage.textContent = 'No Database Exist'
    noDBMessage.classList.add('no-db-message')
    customDeleteArea.appendChild(noDBMessage)
  } else {
    const currentDBContainer = document.createElement('div')
    currentDBContainer.classList.add('custom-select-container')
    customDeleteArea.appendChild(currentDBContainer)

    currentDatabases = document.createElement('select')
    currentDBContainer.appendChild(currentDatabases)

    const dbPlaceholderOption = document.createElement('option')
    dbPlaceholderOption.textContent = 'Database'
    dbPlaceholderOption.setAttribute('disabled', null)
    dbPlaceholderOption.setAttribute('selected', null)
    currentDatabases.appendChild(dbPlaceholderOption)

    databases.forEach(db => {
      const databaseOption = document.createElement('option')
      databaseOption.textContent = db.name
      databaseOption.setAttribute('value', db.name)
      currentDatabases.appendChild(databaseOption)
    })

    const objStoreContainer = document.createElement('div')
    objStoreContainer.classList.add('select-container')
    customDeleteArea.appendChild(objStoreContainer)

    const renderDeleteOSElements = () => {
      objStoreContainer.innerHTML = ''
      let currentObjStores

      if (db.objectStoreNames.length === 0) {
        const noOSMessage = document.createElement('p')
        noOSMessage.textContent = 'No Object Store Exist'
        noOSMessage.classList.add('no-db-message')
        objStoreContainer.appendChild(noOSMessage)
      } else {
        currentObjStores = document.createElement('select')
        objStoreContainer.appendChild(currentObjStores)

        const osPlaceholderOption = document.createElement('option')
        osPlaceholderOption.textContent = 'Object Store'
        osPlaceholderOption.setAttribute('disabled', null)
        osPlaceholderOption.setAttribute('selected', null)
        currentObjStores.appendChild(osPlaceholderOption)

        for (let i = 0; i < db.objectStoreNames.length; i++) {
          const objStoreOption = document.createElement('option')
          objStoreOption.textContent = db.objectStoreNames[i]
          objStoreOption.setAttribute('value', db.objectStoreNames[i])
          currentObjStores.appendChild(objStoreOption)
        }

        currentObjStores.addEventListener('change', e => {
          selectedOSNameForDelete = e.target.value
        })
      }
    }

    currentDatabases.addEventListener('change', async e => {
      selectedDBNameForDelete = e.target.value
      selectedDBVersionForDelete = databases.find(db => db.name === selectedDBNameForDelete).version
      await createIDB(selectedDBNameForDelete, selectedDBVersionForDelete)
      renderDeleteOSElements()
    })
  }
}

const deleteIndexedDB = (key) => {
  const request = indexedDB.open(selectedDBNameForDelete, selectedDBVersionForDelete)

  request.onsuccess = e => {
    db = e.target.result
    const transaction = db.transaction(selectedOSNameForDelete, 'readwrite')
    const objectStore = transaction.objectStore(selectedOSNameForDelete)
    objectStore.delete(key)
    db.close()
  }
}

const getIndexedDB = (key) => new Promise((resolve, reject) => {
  const request = indexedDB.open(selectedDBNameForDelete, selectedDBVersionForDelete)

  request.onsuccess = e => {
    db = e.target.result
    const transaction = db.transaction(selectedOSNameForDelete, 'readonly')
    const objectStore = transaction.objectStore(selectedOSNameForDelete)
    const cursorRequest = objectStore.openCursor()
    const count = objectStore.count()
    let cursorCount = 0
    const getCount = () => new Promise((resolve, reject) => {
      count.onsuccess = () => {
        result = count.result
        resolve(result)
      }
    })

    let result
    getCount().then((value) => {
      result = value
    }).catch((e) => console.log(e))

    cursorRequest.onsuccess = async e => {
      const cursor = e.target.result
      if (cursor) {
        if (cursor.key === key) {
          resolve(cursor.value)
        } else {
          cursorCount++
          if (cursorCount >= result) {
            resolve('')
          }
          cursor.continue()
        }
      }
    }

    cursorRequest.onerror = e => {
      reject(`An error occured: ${e}`)
    }
  }
})
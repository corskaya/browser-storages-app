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
  const labelForExpiration = document.createElement('label')
  labelForExpiration.textContent = 'Expiration date: '
  labelForExpiration.setAttribute('for', 'expiration')
  customAddArea.appendChild(labelForExpiration)

  const expiration = document.createElement('input')
  expiration.setAttribute('type', 'date')
  expiration.setAttribute('id', 'expiration')
  customAddArea.appendChild(expiration)
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
  let currentDBLabel
  let currentDatabases

  const databases = await indexedDB.databases()

  if (databases.length === 0) {
    const noDBMessage = document.createElement('p')
    noDBMessage.textContent = 'No Database Exist'
    customAddArea.appendChild(noDBMessage)
  } else {
    currentDBLabel = document.createElement('label')
    currentDBLabel.textContent = 'Database: '
    customAddArea.appendChild(currentDBLabel)

    currentDatabases = document.createElement('select')
    currentDBLabel.appendChild(currentDatabases)

    const dbPlaceholderOption = document.createElement('option')
    dbPlaceholderOption.textContent = 'Database'
    dbPlaceholderOption.setAttribute('disabled', null)
    dbPlaceholderOption.setAttribute('selected', null)
    currentDatabases.appendChild(dbPlaceholderOption)

    databases.forEach(db => {
      const databaseOption = document.createElement('option')
      databaseOption.textContent = db.name
      databaseOption.setAttribute('value', db.name.toLowerCase())
      currentDatabases.appendChild(databaseOption)
    })
  }

  const createNewDBContainer = document.createElement('div')
  customAddArea.appendChild(createNewDBContainer)

  const btnCreateNewDB = document.createElement('button')
  btnCreateNewDB.textContent = 'Create New Database'
  createNewDBContainer.appendChild(btnCreateNewDB)

  const objStoreContainer = document.createElement('div')
  customAddArea.appendChild(objStoreContainer)

  btnCreateNewDB.addEventListener('click', e => {
    createNewDBContainer.removeChild(e.target)

    const newDBName = document.createElement('input')
    newDBName.setAttribute('placeholder', 'Name')
    createNewDBContainer.appendChild(newDBName)

    const version = document.createElement('input')
    version.setAttribute('type', 'number')
    version.setAttribute('min', '0')
    version.setAttribute('placeholder', 'version')
    createNewDBContainer.appendChild(version)

    const createDB = document.createElement('button')
    createDB.textContent = 'Create'
    createNewDBContainer.appendChild(createDB)

    createDB.addEventListener('click', async () => {
      await createIDB(newDBName.value, version.value)
      await renderAddIDBElements()
    })
  })

  const renderAddOSElements = () => {
    objStoreContainer.innerHTML = ''
    let currentObjStores

    const objStoreLabel = document.createElement('label')
    objStoreLabel.textContent = 'Object Store: '
    objStoreContainer.appendChild(objStoreLabel)

    if (!db || db.objectStoreNames.length === 0) {
      const noOSMessage = document.createElement('p')
      noOSMessage.textContent = 'No Object Store Exist'
      objStoreLabel.appendChild(noOSMessage)
    } else {
      currentObjStores = document.createElement('select')
      objStoreLabel.appendChild(currentObjStores)

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
    objStoreContainer.appendChild(createNewOSContainer)

    const btnCreateNewOS = document.createElement('button')
    btnCreateNewOS.textContent = 'Create New Object Store'
    createNewOSContainer.appendChild(btnCreateNewOS)

    if (currentObjStores) {
      currentObjStores.addEventListener('change', e => {
        selectedOS = e.target.value
      })
    }

    btnCreateNewOS.addEventListener('click', e => {
      createNewOSContainer.removeChild(e.target)

      const newOSName = document.createElement('input')
      newOSName.setAttribute('placeholder', 'Name')
      createNewOSContainer.appendChild(newOSName)

      const createOS = document.createElement('button')
      createOS.textContent = 'Create'
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
    noDBMessage.textContent = 'No Data Exist'
    customDeleteArea.appendChild(noDBMessage)
  } else {
    currentDBLabel = document.createElement('label')
    currentDBLabel.textContent = 'Database: '
    customDeleteArea.appendChild(currentDBLabel)

    currentDatabases = document.createElement('select')
    currentDBLabel.appendChild(currentDatabases)

    const dbPlaceholderOption = document.createElement('option')
    dbPlaceholderOption.textContent = 'Database'
    dbPlaceholderOption.setAttribute('disabled', null)
    dbPlaceholderOption.setAttribute('selected', null)
    currentDatabases.appendChild(dbPlaceholderOption)

    databases.forEach(db => {
      const databaseOption = document.createElement('option')
      databaseOption.textContent = db.name
      databaseOption.setAttribute('value', db.name.toLowerCase())
      currentDatabases.appendChild(databaseOption)
    })

    const objStoreContainer = document.createElement('div')
    customDeleteArea.appendChild(objStoreContainer)

    const renderDeleteOSElements = () => {
      objStoreContainer.innerHTML = ''
      let currentObjStores

      const objStoreLabel = document.createElement('label')
      objStoreLabel.textContent = 'Object Store: '
      objStoreContainer.appendChild(objStoreLabel)

      if (db.objectStoreNames.length === 0) {
        const noOSMessage = document.createElement('p')
        noOSMessage.textContent = 'No Data Exist'
        objStoreLabel.appendChild(noOSMessage)
      } else {
        currentObjStores = document.createElement('select')
        objStoreLabel.appendChild(currentObjStores)

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

    cursorRequest.onsuccess = async e => {
      const cursor = e.target.result

      if (cursor) {
        if (cursor.key === key) {
          resolved = true
          resolve(cursor.value)
        } else {
          cursor.continue()
        }
      }
    }

    cursorRequest.onerror = e => {
      reject(`An error occured: ${e}`)
    }
  }
})
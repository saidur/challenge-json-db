const path = require('path')
const fs = require('fs')
const dataPath = './data/'
var jsonArray = []
var objects = []

module.exports = {
  fileExist,
  writeFile,
  readFile,
  getNestedObject,
  setObjects,
  updateObjects,
  getRequestQuery,
  deletePropertyPath,
  ensureDirectoryExistence
}

function ensureDirectoryExistence (filePath) {
  var dirname = path.dirname(filePath)
  if (fs.existsSync(dirname)) {
    return true
  }
  ensureDirectoryExistence(dirname)
  fs.mkdirSync(dirname)
}

function fileExist (filePath) {
  fs.existsSync(filePath, (err) => {
    if (err) {
      return
    }

    return true
  })
}

async function readFile (filePath) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      console.error(err)
      return
    }
    return data
  })
}

async function writeFile (filePath = dataPath, fileData, callback, encoding = 'utf8') {
  fs.writeFile(filePath, fileData, encoding, (err) => {
    if (err) {
      throw err
    }

    callback()
  })
}

function getNestedObject (nestedObj, pathArr) {
  return pathArr.reduce((obj, key) => (obj && obj[key] !== 'undefined' ? obj[key] : null), nestedObj)
}

function setObjects (keys, value, obj) {
  obj = obj || {}
  keys = typeof keys === 'string'
    ? keys.match(/\w+/g)
    : Array.prototype.slice.apply(keys)
  keys.reduce(function (obj, key, index) {
    obj[key] = index === keys.length - 1
      ? value
      : typeof obj[key] === 'object' && obj !== null
        ? obj[key]
        : {}
    return obj[key]
  }, obj)
  return obj
}

function updateObjects (obj, key, newVal) {
  for (var i in obj) {
    if (i == key) {
      obj[i] = newVal
    }

    if (typeof obj[i] === 'object') {
      objects = objects.concat(updateObjects(obj[i], key, newVal))
    }
  }
  return obj
}

function getRequestQuery (req) {
  var result = []
  // req.body
  for (const key in req.body) {
    result.push({ [key]: req.body[key] })
  }
  return JSON.parse(JSON.stringify(result))
}

function deletePropertyPath (jsonObj, keys) {
  if (!jsonObj || !keys) {
    return
  }

  let prop = keys.pop()
  let parent = keys.reduce((obj, key) => obj[key], jsonObj)
  delete parent[prop]
  return jsonObj
}

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
  ensureDirectoryExistence,
  getObjects
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

function deletePropertyPath (obj, keys) {
  if (!obj || !keys) {
    return
  }

  const _obj = JSON.parse(JSON.stringify(obj))

  keys.reduce((acc, key, index) => {
    if (index === keys.length - 1) {
      delete acc[key]
      return true
    }
    return acc[key]
  }, _obj)

  return _obj
}

function getObjects2 (obj, keys, retval, retkey) {
  obj = obj || {}
  retval = retval || []
  retkey = retkey || []
  let length = keys.length
  let targetKey = keys.shift()
  let finalRes = []

  if (length > 0) {
    for (let prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        if (prop === targetKey) {
          retval.push(obj[prop])
          retkey.push(prop)
        }

        if (obj[prop] instanceof Object || obj[prop] instanceof Array) {
          getObjects(obj[prop], keys, retval, retkey)
        }
      }
    }
  }

  finalRes['keys'] = retkey
  finalRes['value'] = retval
  return finalRes
}

function getObjects (obj, keys) {

  if (!obj || !keys) {
    return
  }
  obj = obj || {}
  const _obj = JSON.parse(JSON.stringify(obj))
  let array_keys =[]
  let objProperty=[]

  keys.reduce((acc, key, index) => {
    
    array_keys.push (key)
    //console.log ('acc:' + JSON.stringify(acc) )
    //console.log ('key:' + key )
    //console.log ('obj:'+JSON.stringify(_obj))
    //console.log ("prop:"+Object.keys(_obj))
    //console.log (array_keys)
    if (acc.hasOwnProperty(key)) {
      if (acc[key] instanceof Object || acc[key] instanceof Array) {
        objProperty = setObjects(array_keys,acc[key])
      }
    }
    
    //console.log (JSON.stringify(objProperty))
   


    return acc[key]
  }, _obj)

  return objProperty

}

var getkeys = function(obj, prefix){
  var keys = Object.keys(obj);
  prefix = prefix ? prefix + '.' : '';
  return keys.reduce(function(result, key){
      if(isobject(obj[key])){
          result = result.concat(getkeys(obj[key], prefix + key));
      }else{
          result.push(prefix + key);
      }
      return result;
  }, []);
};


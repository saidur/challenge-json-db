const fs = require('fs')
const dataPath = './data/'
const jsonHelper = require('./jsonHelper')

module.exports = {
  getStudent,
  createStudent,
  deleteStudent,
  getHealth
}

async function getHealth (req, res, next) {
  res.json({ success: true })
}

async function createStudent (req, res, next) {
  const studentId = req.params.studentId
  const fileName = dataPath + studentId + '.json'
  var requestData = []
  var queryData = ''
  var obj
  var data

  if (req.params[0] != null) {
    var array = req.params[0].split('/')
    requestData = array.filter(function (el) { return el })
    requestData.unshift(req.params.paramName)
  } else {
    requestData.push(req.params.paramName)
  }
  queryData = jsonHelper.getRequestQuery(req)

  jsonHelper.ensureDirectoryExistence(fileName)
  var exists = fs.existsSync(fileName)
  
  try {
    if (exists === false) {
      obj = await jsonHelper.setObjects(requestData, queryData)
      data = JSON.stringify(obj)
    } else {
      var contents = fs.readFileSync(fileName)
      var existObj = JSON.parse(contents)
      obj = await jsonHelper.setObjects(requestData, queryData, existObj)
      data = JSON.stringify(obj)
    }
    await jsonHelper.writeFile(fileName, data, () => {
      res.status(200).json({ success: true })
    })
  } catch (err) {
    console.log(err)
  }
}

async function getStudent (req, res) {
  const studentId = req.params.studentId
  const studentFile = dataPath + studentId + '.json'
  var requestData = []
  var contents, obj, data
  try {
    if (req.params[0] != null) {
      var array = req.params[0].split('/')
      requestData = array.filter(function (el) { return el })
      requestData.unshift(req.params.paramName)
    } else {
      requestData.push(req.params.paramName)
    }
  } catch (err) {
    console.log(err)
  }
  
  const exists = fs.existsSync(studentFile)

  if (exists) {
    contents = fs.readFileSync(studentFile)
    obj = JSON.parse(contents)
    try {    
      
      data = jsonHelper.getObjects(obj,requestData)
      // console.log (JSON.stringify(data))

    } catch (err) {
      console.log(err)
    }
    res.status(200).json({ success: true, msg: data })
  } else {
    res.status(404).json({ error: 'Not Found' })
  }
}

async function deleteStudent (req, res) {
  const studentId = req.params.studentId
  const studentFile = dataPath + studentId + '.json'
  const exists = fs.existsSync(studentFile)
  var requestData = []
  var contents, obj, data

  if (req.params[0] != null) {
    var array = req.params[0].split('/')
    requestData = array.filter(function (el) { return el })
    requestData.unshift(req.params.paramName)
  } else {
    requestData.push(req.params.paramName)
  }

  if (exists) {
    contents = fs.readFileSync(studentFile)
    obj = JSON.parse(contents)
    // var newObj = jsonHelper.removeKeys(obj, requestData)
    var newObj = jsonHelper.deletePropertyPath(obj, requestData)
    data = JSON.stringify(newObj)
    console.log (JSON.stringify(data))
    await jsonHelper.writeFile(studentFile, data, () => {
      res.status(200).json({ success: true, msg: data })
    })
  } else {
    res.status(404).json({ error: 'Not Found' })
  }
}

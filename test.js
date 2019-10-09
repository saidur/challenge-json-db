const tape = require('tape')
const jsonist = require('jsonist')

const port = (process.env.PORT = process.env.PORT || require('get-port-sync')())
const endpoint = `http://localhost:${port}`

const server = require('./server')

tape('health', async function (t) {
  const url = `${endpoint}/health`
  jsonist.get(url, (err, body) => {
    if (err) t.error(err)
    t.ok(body.success, 'should have successful healthcheck')
    t.end()
  })
})

tape('create new student record  in a student file', async function (t) {
  const url = `${endpoint}/saidur/courses/math/quizzes/ye0ab61`
  const data = { 'score': 55 }
  jsonist.put(url, data, (err, body) => {
    if (err) t.error(err)
    t.ok(body.success, 'should have successful new student record ')
    t.end()
  })
})
tape('create new properties record  in existing student file', async function (t) {
  const url = `${endpoint}/saidur/courses/physics/quizzes/ye0ab61`
  const data = { 'score': 75 }
  jsonist.put(url, data, (err, body) => {
    if (err) t.error(err)
    t.ok(body.success, 'should have successful new student record ')
    t.end()
  })
})

tape('get student record ', async function (t) {
  const url = `${endpoint}/saidur/courses/physics/`
  jsonist.get(url, (err, body) => {
    if (err) t.error(err)
    t.ok(body.success, 'should have successful get student record')
    t.end()
  })
})

tape('delete student record ', async function (t) {
  const url = `${endpoint}/saidur/courses/math/quizzes/ye0ab61`
  jsonist.delete(url, (err, body) => {
    if (err) t.error(err)
    t.ok(body.success, 'should have successful delete student record')
    t.end()
  })
})

tape('cleanup', function (t) {
  server.close()
  t.end()
})

const { readFile, writeFile } = require('node:fs/promises')
const path = require('node:path')

const { parse } = require('yaml')
const ics = require('ics')

;(async () => {
  const [inputFilePath] = process.argv.slice(2)

  const todoFile = await readFile(inputFilePath).then((buffer) => buffer.toString())
  const { todos } = parse(todoFile)

  const convertDate = (date) => ([
    date.getYear(),
    date.getMonth(),
    date.getDay(),
    date.getHours(),
    date.getMinutes(),
    date.getSeconds()
  ])

  const events = []
  for (const todo of todos) {
    const event = {
      title: todo.task,
      start: convertDate(new Date(todo.start)),
      end: convertDate(new Date(todo.end)),
      status: 'CONFIRMED',
      busyStatus: 'BUSY'
    }

    events.push(event)
  }

  ics.createEvents(events, async (error, value) => {
    if (error !== null) {
      console.error(error)
    } else {
      const outputFileName = path.basename(inputFilePath).split('.')[0]
      await writeFile('./' + outputFileName + '.ics', value)
    }
  })
})()

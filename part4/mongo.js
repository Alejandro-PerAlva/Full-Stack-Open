const mongoose = require('mongoose')

const url =
  `mongodb+srv://fullstack:1q2w3e4r5t6y7u8i9o@cluster0.qmwjc.mongodb.net/testNoteApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

const note1 = new Note({
  content: 'HTML is easy',
  important: true,
})

const note2 = new Note({
    content: 'Browser can execute only JavaScript',
    important: false,
  })

const note3 = new Note({
    content: 'GET and POST are the most important methods of HTTP protocol',
    important: true,
  })

Note.find({}).then(result => {
    result.forEach(note => {
      console.log(note)
    })
  })

note1.save().then(result => {
    console.log(result)
    console.log('note saved!')
    //mongoose.connection.close()
  })

note2.save().then(result => {
    console.log(result)
    console.log('note saved!')
    //mongoose.connection.close()
  })

note3.save().then(result => {
    console.log(result)
    console.log('note saved!')
    mongoose.connection.close()
  })
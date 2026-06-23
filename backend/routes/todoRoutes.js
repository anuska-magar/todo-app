const express = require('express')
const router = express.Router()
const Todo = require('../models/Todo')
const protect = require('../middleware/authMiddleware')

// All todo routes are protected — user must be logged in

// Get all todos for logged in user
router.get('/', protect, async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user.id })
    res.status(200).json(todos)
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error })
  }
})

// Create a new todo
router.post('/', protect, async (req, res) => {
  try {
    const { title } = req.body

    const todo = await Todo.create({
      title,
      user: req.user.id
    })

    res.status(201).json(todo)
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error })
  }
})

// Update a todo
router.put('/:id', protect, async (req, res) => {
  try {
    const { title, completed } = req.body

    const todo = await Todo.findByIdAndUpdate(
      req.params.id,
      { title, completed },
      { new: true }
    )

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' })
    }

    res.status(200).json(todo)
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error })
  }
})

// Delete a todo
router.delete('/:id', protect, async (req, res) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id)

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' })
    }

    res.status(200).json({ message: 'Todo deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error })
  }
})

module.exports = router
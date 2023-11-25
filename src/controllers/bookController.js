const bookModel = require('../models/bookModel')
const { use } = require('../routes/route')

module.exports = {
    addBook: async (req, res) => {
        try {
            let saveData = await bookModel.create(req.body)
            return res.status(201).send({ status: true, msg: "Book added successfully", Data: saveData })
        } catch (error) {
            return res.status(500).send({ status: false, msg: error.message })
        }
    },

    updateBook: async (req, res) => {
        try {
            let { userId, bookId } = req.params
            let data = req.body
            if (Object.keys(data).length < 1) {
                return res.status(400).send({ status: false, message: "Please enter data whatever you want to update" })
            }
            data['updatedAt'] = new Date().toLocaleString()
            let updateData = await bookModel.findOneAndUpdate({ userId: userId, isDeleted: false, _id: bookId }, data, { new: true })
            if (!updateData) {
                return res.status(404).send({ status: false, msg: "Book not found" })
            }
            return res.status(200).send({ status: true, Data: updateData })
        } catch (error) {
            return res.status(500).send({ status: false, msg: error.message })
        }
    },

    removeBook: async (req, res) => {
        try {
            let { bookId, userId } = req.params
            let books = await bookModel.findOneAndUpdate({ _id: bookId, userId: userId, isDeleted: false }, { isDeleted: true })
            if (!books) {
                return res.status(404).send({ status: false, msg: "Book not found" })
            }
            return res.status(200).send({ status: true, msg: 'Book removed from system successfully', Data: books })
        } catch (error) {
            return res.status(500).send({ status: false, msg: error.message })
        }
    },

    viewBooks: async (req, res) => {
        try {
            let books = await bookModel.find({
                $and: [
                    { removedUser: { $nin: [req.decodedToken.userId] } },
                    { isDeleted: false }
                ]
            })
            if (!books) {
                return res.status(404).send({ status: false, msg: "Book not found" })
            }
            return res.status(200).send({ status: true, Data: books })
        } catch (error) {
            return res.status(500).send({ status: false, msg: error.message })
        }
    },

    viewBookById: async (req, res) => {
        try {
            let { bookId } = req.params
            let book = await bookModel.findOne({
                $and: [
                    { removedUser: { $nin: [req.decodedToken.userId] } },
                    { _id: bookId, isDeleted: false }
                ]
            })
            if (!book) {
                return res.status(404).send({ status: false, msg: "Book not found" })
            }
            return res.status(200).send({ status: true, Data: book })
        } catch (error) {
            return res.status(500).send({ status: false, msg: error.message })
        }
    },

    borrowBook: async (req, res) => {
        try {
            let { bookId } = req.params
            let books = await bookModel.findOneAndUpdate({
                $and: [
                    { removedUser: { $nin: [req.decodedToken.userId] } },
                    { _id: bookId, isDeleted: false, availablity: 'AVAILABLE' }
                ]
            }, { availablity: 'BORROWED' })
            if (!books) {
                return res.status(404).send({ status: false, msg: "Book is not available" })
            }
            return res.status(200).send({ status: true, Data: books })
        } catch (error) {
            return res.status(500).send({ status: false, msg: error.message })
        }
    },

    returnBook: async (req, res) => {
        try {
            let { bookId } = req.params
            let books = await bookModel.findOneAndUpdate({
                $and: [
                    { removedUser: { $nin: [req.decodedToken.userId] } },
                    { _id: bookId, isDeleted: false, availablity: 'BORROWED' }
                ]
            }, { availablity: 'AVAILABLE' })
            if (!books) {
                return res.status(404).send({ status: false, msg: "Book is not found" })
            }
            return res.status(200).send({ status: true, Data: books })
        } catch (error) {
            return res.status(500).send({ status: false, msg: error.message })
        }
    },
}
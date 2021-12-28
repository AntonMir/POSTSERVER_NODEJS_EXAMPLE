const { Router } = require('express')
const { check, validationResult } = require('express-validator')
const config = require('config')
const router = Router()

const sendEmail = require('@mailers/post.mailer.js')

router.post('/', [check('email', 'Некорректный email').isEmail()], async (req, res) => {
    try {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: {
                    RU: 'Некорректный Email',
                    EN: 'Incorrect Email',
                },
            })
        }

        const userData = await req.body

        if (!isEmptyObject(userData)) {
            sendEmail(config.get('emailReceiver'), userData)
            console.log('------------- User Data ---------------')
            console.log(userData)
            console.log('---------------------------------------')
        }

        res.status(200).json({
            message: {
                RU: 'Спасибо за обратную связь! Ваше сообщение отправлено!',
                EN: 'Thanks for your feedback! Your message has been sent!',
            },
        })
        // 'В ближайшее время мы с Вами свяжемся и ответим на все вопросы'
    } catch (e) {
        res.status(500).json({
            message: {
                RU: 'Что-то пошло не так, попробуйте снова',
                EN: 'Something went wrong, please try again',
            },
        })
    }
})

function isEmptyObject(obj) {
    for (var i in obj) {
        if (obj.hasOwnProperty(i)) {
            return false
        }
    }
    return true
}

module.exports = router

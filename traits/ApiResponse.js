const responseNotFound = (res) => {
    res.status(404).json({
        succes: false,
        message: 'Not Found'
    })
}

const responseSuccess = (res, result, message) => {
    return res.status(200).json({
        succes: true,
        message: message,
        data: result
    })
}

const responseFailValidate = (res, message) => {
    return res.status(400).json({
        success: false,
        message: message
    })
}
const responseAuthSuccess = (res, token, message, user) => {
    return res.status(200).json({
        succes: true,
        token: token,
        message: message,
        user: user
    })

}



module.exports = {
    responseNotFound,
    responseSuccess,
    responseAuthSuccess,
    responseFailValidate
   
}
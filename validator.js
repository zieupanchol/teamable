function isInvalidEmail(testObject) {
    return !testObject.email.includes('@')
}

function isEmptyPayload(testObject) {
    return Object.keys(testObject).length === 0
}

module.exports = {
isInvalidEmail, isEmptyPayload
}
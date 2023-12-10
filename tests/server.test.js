const request = require('supertest')
const { app, server } = require('./server.js')

test('user profile data with valid payload test', async () => {
    const testPayload = {
        name: 'test name',
        email: 'test.email@example.com',
        interests: 'test'
    }
    const response = await request(app)
        .post('/save-user-profile')
        .send(testPayload)

    console.log(response.body)
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('info')
    expect(response.body.info).toBe("user data has been saved successfully")


})

test('user profile data with invalid payload test', async () => {
    const testPayload = {}
    const response = await request(app)
        .post('/save-user-profile')
        .send(testPayload)

    console.log(response.body)
    expect(response.body).toHaveProperty('error')
    expect(response.body.error).toBe("Invalid paylaod. Couldn't update user profile data")
})

server.close()
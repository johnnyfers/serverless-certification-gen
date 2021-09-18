

export const handle = async (event) => {

    return {
        statusCode: 201,
        body: JSON.stringify({
            message: 'hello from serverless',
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    }
}
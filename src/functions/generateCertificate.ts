import { document } from '../utils/dynamodbClient'

import chromium from 'chrome-aws-lambda'
import path from 'path'
import fs from 'fs'
import handlebars from 'handlebars'
import dayjs from 'dayjs'

interface ICreateCertificate {
    id: string
    name: string
    grade: string
}

interface ITemplate extends ICreateCertificate {
    date: string,
    medal: string
}

const compile = async function (data: ITemplate) {
    const filePath = path.join(process.cwd(), 'src', 'templates', 'certificate.hbs')

    const html = fs.readFileSync(filePath, 'utf-8')

    return handlebars.compile(html)(data)
}

export const handle = async (event) => {
    const { id, name, grade } = JSON.parse(event.body) as ICreateCertificate

    await document.put({
        TableName: 'users_certificates',
        Item: {
            id,
            name,
            grade
        }
    }).promise()

    const medalPath = path.join(process.cwd(), 'src', 'templates', 'selo.png')
    const medal = fs.readFileSync(medalPath, 'base64')

    const data: ITemplate = {
        date: dayjs().format('DD/MM/YYYY'),
        grade,
        name,
        id,
        medal
    }

    const content = await compile(data)

    return {
        statusCode: 201,
        body: JSON.stringify({
            message: 'Certificate created successfully'
        }),
        headers: {
            'Content-Type': 'application/jsonname'
        }
    }
}
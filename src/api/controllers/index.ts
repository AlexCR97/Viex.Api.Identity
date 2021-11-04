import express, { Express, NextFunction, Request, Response } from 'express'
import Container from 'typedi'
import AuthenticationMiddleware from '../middleware/Authentication.middleware'
import AuthController from './Auth.controller'
import UsersController from './Users.controller'

const authController = Container.get(AuthController)
const usersController = Container.get(UsersController)

export default function(app: Express) {
    console.log('Initializing controllers...')

    app.use(express.json({
        type: '*/*',
    }))
    
    app.post('/authenticate', async (request: Request, response: Response, next: NextFunction) => {
        try {
            await authController.authenticateAsync(request, response)
        } catch (err) {
            next(err)
        }
    })

    app.post('/logout', async (request: Request, response: Response, next: NextFunction) => {
        try {
            await authController.logout(request, response)
        } catch (err) {
            next(err)
        }
    })

    app.get('/myProfile', AuthenticationMiddleware, async (request: Request, response: Response, next: NextFunction) => {
        try {
            await usersController.getMyProfile(request, response)
        } catch (err) {
            next(err)
        }
    })

    app.post('/refreshToken', async (request: Request, response: Response, next: NextFunction) => {
        try {
            await authController.refreshToken(request, response)
        } catch (err) {
            next(err)
        }
    })

    app.post('/signUp', async (request: Request, response: Response, next: NextFunction) => {
        try {
            await usersController.signUpAsync(request, response)
        } catch (err) {
            next(err)
        }
    })

    console.log('Controllers initialized!')
}

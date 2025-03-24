import { Express } from 'express'
import authRoute from './auth.route'
import userRoute from './user.route'


const initiateRoutes = (app: Express) => {
    const apiV1Initials = '/api/v1'
    const factoringFinance = '/factoring-finance'
    const distributorFinance = '/distributor-finance'
    const reverseFactoring = '/reverse-factoring'
    const workOrderFinance = '/work-order-finance'
    const settings = '/settings'

    

   
    // Runs before each requests
    app.use((req, res, next) => {
        res.locals.startEpoch = Date.now()
        next()
    })

    app.use(apiV1Initials + '/auth', authRoute) // auth router
    app.use(apiV1Initials + '/admin', userRoute)
    // app.use(apiV1Initials + '/notifications', AuthMiddleware.ssclAuthenticated, notificationRoutes)
    // app.use(apiV1Initials + '/general', AuthMiddleware.ssclAuthenticated, csrfProtection, general)
    // app.use(apiV1Initials + '/chart', AuthMiddleware.ssclAuthenticated, csrfProtection, chartRoutes)

    // factoring finance
    // app.use(
    //     apiV1Initials + factoringFinance + '/limit',
    //     // AuthMiddleware.ssclAuthenticated,
    //     // csrfProtection,
    //     // factoringFinanceLimit
    // )
   
}
export default initiateRoutes

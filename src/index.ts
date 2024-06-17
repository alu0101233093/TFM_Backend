import expressApp from "./app"
import { swaggerDocs } from './swagger'
import { PORT } from "./consts"

expressApp.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
    swaggerDocs(expressApp, PORT)
})
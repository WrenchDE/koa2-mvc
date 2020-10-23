import fs from 'fs'
import Path from 'path'
import Router from 'koa-router'
const router = Router()

export default relativePath => {
  const files = fs.readdirSync(relativePath + '/api')
  const jsFiles = files.filter( f => f.endsWith('.js'))
  jsFiles.map(async file => {
    let mapping = (await import(relativePath + '/api/' + file)).default
    for (let way in mapping) {
      if (way !== 'config') {
        for (let method in mapping[way]) {
          let path = '/' + file.substr(0, file.length - 3) + '/' + method
          if (mapping.config && mapping.config[method]) router[way](path, mapping.config[method], mapping[way][method])
          else router[way](path, mapping[way][method])
          console.log(path)
        }
      }
    }
  })
  return router.routes()
}

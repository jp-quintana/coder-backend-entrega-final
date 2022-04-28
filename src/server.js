const express = require('express')
const { Router } = express

const ContenedorArchivoProductos = require('./contenedores/ContenedorArchivoProductos.js')
const ContenedorArchivoCarritos = require('./contenedores/ContenedorArchivoCarritos.js')

//--------------------------------------------
// instancio servidor y persistencia

const app = express()

const productosApi = new ContenedorArchivoProductos('dbProductos.json')
const carritosApi = new ContenedorArchivoCarritos('dbCarritos.json')

//--------------------------------------------
// permisos de administrador MIDDLEWARES

const esAdmin = true

function crearErrorNoEsAdmin(ruta, metodo) {
  const error = {
    error: -1
  }
  if (ruta && metodo) {
    error.descripcion = `ruta '${ruta}' metodo '${metodo}' no autorizado`
  } else {
    error.descripcion = 'no autorizado'
  }
  return error
}

function soloAdmins(req, res, next) {
  if (!esAdmin) {
    res.json(crearErrorNoEsAdmin())
  } else {
    next()
  }
}

//--------------------------------------------
// configuro router de productos

const productosRouter = new Router()

productosRouter.get('/:id?', async (req, res, next) => {
  try {
    if (req.params.id) {
      const producto = await productosApi.listar(req.params.id);
      res.json(producto)

    } else {
      const productos = await productosApi.listarAll()
      res.json(productos)
    }
  } catch (error) {
    return next(error);
  }
})

productosRouter.post('/', soloAdmins, async (req, res, next) => {
  try {
    const productoGuardado = await productosApi.guardar(req.body)
    res.send(productoGuardado)
  } catch (error) {
    return next(error);
  }
})

productosRouter.put('/:id', soloAdmins, async (req, res, next) => {
  try {
    const productoActualizado = await productosApi.actualizar(req.body, parseInt(req.params.id))
    res.send(productoActualizado)
  } catch (error) {
    return next(error);
  }
})

productosRouter.delete('/:id', async (req, res, next) => {
  try {
    const productoBorrado = await productosApi.borrar(parseInt(req.params.id))
    res.send(productoBorrado)
  } catch (error) {
    return next(error);
  }
})

//--------------------------------------------
// configuro router de carritos

const carritosRouter = new Router()

carritosRouter.post('/', async (req, res, next) => {
  try {
    console.log(req.body);
    const carrito = await carritosApi.crear(req.body)
    res.sendStatus(carrito)
  } catch (error) {
    return next(error);
  }
})

carritosRouter.delete('/:id', async (req, res, next) => {
  try {
    const carritoBorrado = await carritosApi.borrar(parseInt(req.params.id))
    res.send(carritoBorrado)
  } catch (error) {
    return next(error);
  }
})

carritosRouter.get('/:id/productos', async (req, res, next) => {
  try {
    const carrito = await carritosApi.listar(req.params.id);
    res.json(carrito)
  } catch (error) {
    return next(error);
  }
})

// carritosRouter.post('/:id/productos', async (req, res, next) => {
//   try {
//     // const productosTodos = await productosApi.listarAll()
//     // res.send(productosTodos)
//   } catch (error) {
//     // return next(error);
//   }
// })

carritosRouter.delete('/:id/productos/:id_prod', async (req, res, next) => {
  try {
    const productoCarritoBorrado = await productosApi.borrarProductoCarrito(parseInt(req.params.id), parseInt(req.params.id__prod))
    res.send(productoCarritoBorrado)
  } catch (error) {
    return next(error);
  }
})



//--------------------------------------------
// configuro el servidor

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

app.use('/api/productos', productosRouter)
app.use('/api/carritos', carritosRouter)

module.exports = app

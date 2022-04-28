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
      const producto = await productosApi.listar(parseInt(req.params.id));
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
    res.json(productoGuardado)
  } catch (error) {
    return next(error);
  }
})

productosRouter.put('/:id', soloAdmins, async (req, res, next) => {
  try {
    const productoActualizado = await productosApi.actualizar(req.body, parseInt(req.params.id))
    res.json(productoActualizado)
  } catch (error) {
    return next(error);
  }
})

productosRouter.delete('/:id', async (req, res, next) => {
  try {
    const productoBorrado = await productosApi.borrar(parseInt(req.params.id))
    res.json(productoBorrado)
  } catch (error) {
    return next(error);
  }
})

//--------------------------------------------
// configuro router de carritos

const carritosRouter = new Router()

carritosRouter.get('/', async (req, res, next) => {
  try {
    const carrito = (await carritosApi.listarAll()).map(carrito => carrito.id)
    res.json(carrito)
  } catch (error) {
    return next(error);
  }
})

carritosRouter.post('/', async (req, res, next) => {
  try {
    const carritoId = await carritosApi.crear(req.body)
    res.json({ id: carritoId })
  } catch (error) {
    return next(error);
  }
})

carritosRouter.delete('/:id', async (req, res, next) => {
  try {
    const carritoBorrado = await carritosApi.borrar(parseInt(req.params.id))
    res.json(carritoBorrado)
  } catch (error) {
    return next(error);
  }
})

carritosRouter.get('/:id/productos', async (req, res, next) => {
  try {
    const productos = await carritosApi.listar(parseInt(req.params.id))
    res.json(productos)
  } catch (error) {
    return next(error);
  }
})

carritosRouter.post('/:id/productos', async (req, res, next) => {
  try {
    const { id } = req.body
    const producto = await productosApi.listar(parseInt(id))
    const carrito = await carritosApi.guardar(parseInt(req.params.id), producto)
    res.json(carrito)

  } catch (error) {
    return next(error);
  }
})

carritosRouter.delete('/:id/productos/:id_prod', async (req, res, next) => {
  try {
    const productoCarritoBorrado = await carritosApi.borrarProductoCarrito(parseInt(req.params.id), parseInt(req.params.id_prod))
    res.json(productoCarritoBorrado)
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

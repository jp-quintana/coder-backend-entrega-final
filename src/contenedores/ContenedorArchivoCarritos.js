const fs = require('fs')

class ContenedorArchivoCarritos {
    constructor(ruta) {
        this.ruta = ruta.toString();
    }

    async crear(obj) {
      try {
        const contenido = await fs.promises.readFile(`${this.ruta}`, 'utf-8');
        const carritos = JSON.parse(contenido)

        let date = new Date().toLocaleString();

        obj.id = carritos.length + 1,
        obj.timestamp = date,
        obj.productos = []

        carritos.push(obj)

        await fs.promises.writeFile(`${this.ruta}`, JSON.stringify(carritos))

        return obj.id;

      } catch (error) {
        console.log(error);
      }
    }

    async listar(id) {
      try {
        const contenido = await fs.promises.readFile(`${this.ruta}`, 'utf-8');
        const carritos = JSON.parse(contenido)

        const carrito = carritos.find(carrito => carrito.id === id)

        if (!carrito) {
          console.log(null);
        } else {
          return carrito.productos;
        }

      } catch (error) {
        console.log(error);
      }
    }

    async listarAll() {
      try {
        const contenido = await fs.promises.readFile(`${this.ruta}`, 'utf-8');
        const carritos = JSON.parse(contenido)

        return carritos;

      } catch (error) {
        console.log(error);
      }
    }

    async guardar(id, producto) {
      try {
        const contenido = await fs.promises.readFile(`${this.ruta}`, 'utf-8');
        const carritos = JSON.parse(contenido)

        const carrito = carritos.find(carrito => carrito.id === id)

        const carritoIndice = carritos.indexOf(carrito)

        // if (carritos[carritoIndice].productos.indexOf(producto)) {
        // }

        const prubaEnCarrito = carritos[carritoIndice].productos.find(item => item.id === producto.id)

        if (prubaEnCarrito) {
          return;
        }

        carritos[carritoIndice].productos.push(producto)

        await fs.promises.writeFile(`${this.ruta}`, JSON.stringify(carritos))

      } catch (error) {
        console.log(error);
      }
    }

    async borrarProductoCarrito(id, id_prod) {
      const contenido = await fs.promises.readFile(`${this.ruta}`, 'utf-8');
      const carritos = JSON.parse(contenido)

      const carrito = carritos.find(carrito => carrito.id === id)

      if (!carrito) {
        throw new Error(`No existe el carrito con el id ${id}`)
      }

      const indiceCarrito = carritos.indexOf(carrito)

      const producto = carritos[indiceCarrito].productos.find(producto => producto.id === id_prod)

      if (!producto) {
        throw new Error(`No existe el producto con el id ${id_prod} dentro del carrito con id ${id}`)
      }

      const indiceProducto = carritos[indiceCarrito].productos.indexOf(producto)

      carritos[indiceCarrito].productos.splice(indiceProducto, 1)

      for (let i = 0; i < carritos[indiceCarrito].productos.length; i++) {
        carritos[indiceCarrito].productos[i].id = i + 1;
      }

      await fs.promises.writeFile(`${this.ruta}`, JSON.stringify(carritos))
    }
}

module.exports = ContenedorArchivoCarritos

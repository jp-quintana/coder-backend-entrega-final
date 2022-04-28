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

        let carrito = {
          id: carritos.length + 1,
          timestamp: date,
          productos: obj
        }

        carritos.push(carrito)

        await fs.promises.writeFile(`${this.ruta}`, JSON.stringify(carritos))

        return carrito.id;

      } catch (error) {
        console.log(error);
      }
    }

    async listar(id) {
      try {
        const contenido = await fs.promises.readFile(`${this.ruta}`, 'utf-8');
        const items = JSON.parse(contenido)

        const check = items.filter(item => item.id === id)

        if (check.length === 0) {
          console.log(null);
        } else {
          return check;
        }

      } catch (error) {
        console.log(error);
      }
    }

    async listarAll() {
      try {
        const contenido = await fs.promises.readFile(`${this.ruta}`, 'utf-8');
        const items = JSON.parse(contenido)

        return items;

      } catch (error) {
        console.log(error);
      }
    }

    async guardar(obj) {
      try {
        const contenido = await fs.promises.readFile(`${this.ruta}`, 'utf-8');
        const items = JSON.parse(contenido)

        obj.id = items.length + 1;
        items.push(obj)

        await fs.promises.writeFile(`${this.ruta}`, JSON.stringify(items))

        console.log(obj.id);

      } catch (error) {
        console.log(error);
      }
    }

    async actualizar(elem, id) {
      try {
        const contenido = await fs.promises.readFile(`${this.ruta}`, 'utf-8');
        const items = JSON.parse(contenido)

        const itemACambiar = items.find(item => item.id === id)

        if (!itemACambiar) {
          console.log({ error: 'producto no encontrado'})
        }

        const indice = items.indexOf(itemACambiar)

        items[indice] = elem
        items[indice].id = id

        await fs.promises.writeFile(`${this.ruta}`, JSON.stringify(items))
      } catch (error) {
        console.log(error);
      }
    }

    async borrar(id) {
      const contenido = await fs.promises.readFile(`${this.ruta}`, 'utf-8');
      const items = JSON.parse(contenido)

      const item = items.find(item => item.id === id)

      if (!item) {
        throw new Error(`No existe el producto con el id ${id}`)
      }

      const indice = items.indexOf(item)

      items.splice(indice, 1)

      for (let i = 0; i < items.length; i++) {
        items[i].id = i + 1;
      }

      await fs.promises.writeFile(`${this.ruta}`, JSON.stringify(items))
    }

    async borrarProductoCarrito(id, id_prod) {
      const contenido = await fs.promises.readFile(`${this.ruta}`, 'utf-8');
      const carritos = JSON.parse(contenido)

      const carrito = carritos.find(carrito => carrito.id === id)

      if (!carrito) {
        throw new Error(`No existe el carrito con el id ${id}`)
      }

      const indiceCarrito = carritos.indexOf(carrito)

      const producto = carritos.indiceCarrito.productos.find(producto => producto.id === id_prod)

      if (!producto) {
        throw new Error(`No existe el producto con el id ${id_prod} dentro del carrito con id ${id}`)
      }

      indiceProducto = carritos.indiceCarrito.productos.indexOf(producto)

      carritos.indiceCarrito.productos.splice(indiceProducto, 1)

      for (let i = 0; i < carritos.indiceCarrito.productos.length; i++) {
        carritos.indiceCarrito.productos[i].id = i + 1;
      }

      await fs.promises.writeFile(`${this.ruta}`, JSON.stringify(carritos))
    }
}

module.exports = ContenedorArchivoCarritos

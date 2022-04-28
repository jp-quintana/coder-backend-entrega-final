const fs = require('fs')

class ContenedorArchivoProductos {
    constructor(ruta) {
        this.ruta = ruta.toString();
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

        let date = new Date().toLocaleString();

        obj.id = items.length + 1;
        obj.timestamp = date;
        obj.descripcion = "";
        obj.stock = "";

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
}

module.exports = ContenedorArchivoProductos

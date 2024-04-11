const fs = require(`fs`).promises;

const path = `./productos.json`

class ProductManager {
    constructor(path){
        this.path = path;
        this.products = [];
        this.nextId = 1;
        this.getProductsFromFile();
    }

    getProductsFromFile= async () => {
        try {
            const fileExists = await fs.access(this.path)
            .then(() => true)
            .catch(() => false);

            if (!fileExists) {
                console.log("El archivo de productos no existe. Se creará uno nuevo.");
                await fs.writeFile(this.path, '[]', 'utf-8');
                console.log("Archivo de productos creado correctamente.");
            return [];            
            }
            const dataJson = await fs.readFile(this.path, `utf-8`)
            if (dataJson.trim() === "") {
                console.log("El archivo de productos está vacío.");
                return;
            }
            //console.log('Datos leídos del archivo:', dataJson);
            return JSON.parse(dataJson);

        } catch (error) {
            console.error(`Error al leer el archivo de productos:`, error.message);
            return [];
        }
    }

    saveProductsToFile = async () => {
        try {
            await fs.writeFile(this.path, JSON.stringify(this.products, null, '\t'), 'utf-8')
            console.log(`Producto guardado en el archivo:`, this.path);   
            
        } catch (error) {
            console.error(`Error al guardar los productos en el archivo`, error.message);
        }

    }
    
    addProduct = async (product) => {
        try{ 
            const productsOnFile = await this.getProductsFromFile();
          /*   if(productsOnFile.length === 0) {
                product.id = 1
            } else {
                product.id = productsOnFile.length + 1
            }         */
            if (!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock) {
                console.error('Todos los campos son obligatorios.');
                return;
            }             
            if (productsOnFile.some(prod => prod.code === product.code)) {
                console.error('Ya existe un producto con el mismo código.');
                return;
            } else {
                const newProduct = {
                id: this.nextId++,
                title: product.title,
                description: product.description,
                price: product.price,
                thumbnail: product.thumbnail,
                code: product.code,
                stock: product.stock
                };
            this.products.push(newProduct);
            await this.saveProductsToFile(newProduct)
            console.log('Producto agregado:', newProduct);           
            }
        } catch (error) {
            console.error(`Error al agregar producto`, error.message);
        }
    }

    getProducts = async () => {
        try{
            return await this.getProductsFromFile()
        } catch (error) {
            console.log(`Error al obtener los productos`, error.message);
        }
    }

    getProductById = async (pid) => {
        try {
            await this.getProductsFromFile();
            const product = this.products.find(prod => prod.id === pid);

            if (product) {
                console.log(`Producto encontrado:`, product)
                return product;
            } else {
                console.error('Producto no encontrado');
                return null;
            }
        }catch (error) {
            console.error(`Error al obtener el producto por ID:`, error.message)
            return null;
        }
    }

    updateProduct = async (pid, productToUpdate) => {
        try {
            await this.getProductsFromFile();
            const index = this.products.findIndex(prod => prod.id === pid);

            if (index !== -1) {
                Object.assign(this.products[index], productToUpdate)
                await this.saveProductsToFile(this.products)
                console.log(`Producto actualizado:`, this.products[index]);
            } else {
                console.error (`Producto no encontrado`)
            }

        }catch (error) {
            console.error(`Error al actualizar el producto:`, error.message);
        }
    }

    deleteProduct= async (pid) => {
        try {
            await this.getProductsFromFile();
            const index = this.products.findIndex(product => product.id === pid);
        if (index !== -1) {
            this.products.splice(index, 1);
            await this.saveProductsToFile();
            console.log(`Producto eliminado con ID:`, pid);
        }            
        } catch (error) {
            console.error (`Error al eliminar el producto:`, error.message);
        }
    }
}

module.exports = ProductManager;


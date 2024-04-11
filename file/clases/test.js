const ProductManager = require(`./productManager`);

// Ruta al archivo JSON de productos
const filePath = './productos.json';

// Crea una instancia de ProductManager
const productManager = new ProductManager(filePath);

// Define una función asincrónica para ejecutar las pruebas
async function runTests() {
  // Agrega algunos productos de prueba
  await productManager.addProduct({
    title: 'Producto 1',
    description: 'Descripción del producto 1',
    price: 10,
    thumbnail: 'imagen1.jpg',
    code: 'ABC123',
    stock: 20
  });

  await productManager.addProduct({
    title: 'Producto 2',
    description: 'Descripción del producto 2',
    price: 20,
    thumbnail: 'imagen2.jpg',
    code: 'DEF456',
    stock: 15
  });

  // Obtiene todos los productos y los muestra en la consola
  const products = await productManager.getProducts();
  console.log('Productos:', products);

  // Obtiene un producto por ID
  const productById = await productManager.getProductById(1);

  // Actualiza un producto
  await productManager.updateProduct(1, { price: 15 });

  // Elimina un producto
  await productManager.deleteProduct(2);
}

// Ejecuta las pruebas
runTests();
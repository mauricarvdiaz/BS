/**Local Url */
//const url = 'http://localhost:3900/api/';
/**Heroku url */
const url = 'https://bsale-apirest.herokuapp.com/api/'

/**
 * Variables globales
 *  - @Global_var {Array} products: Arreglo que contiene los productos obtenidos al consultar a al Api. Los productos que contiene son los que se muestran en la vista.
 *  - @Global_var {Number} products_length: cantidad de productos.
 *  - @Global_var {Number} pageNumber: pagina en que se encuentra la paginación. Se muestran los productos que se encuentras en la pagina que 'pageNumber' tiene.
 *  - @Global_var {Number} pageSize
 *  - @Global_var {Array} carrito: Arreglo donde se agregan los productos que se van a comprar.
 */
let products = [];
let products_length = 0;
let pageNumber = 1;
let pageSize = 12;
let carrito = [];

if ('loading' in HTMLImageElement.prototype) {
        console.log('Browser support `loading`...');
    } else { 
        console.log('Not supported');
}

/**  Funcion que controla el boton activo de las categorias
 * @param {*} category : tipo String. Corresponde a la categoria seleccionada en la vista (cerveza, vodka, snack, bebidas, ron, etc).
 * 
 * @Descripcion Funcion que desactiva el boton seleccionado quitando la clase .active y agrega la clase .active al boton de la categoria seleccionada.
 */
function categoryActive(category) {
    const listCategories = document.querySelector('#categories');
    listCategories.childNodes.forEach(node => {
        if(node.firstChild){
            if(node.firstChild.classList.contains('active')){
                /**remover clase active */
                node.firstChild.classList = []
            }
            if(node.firstChild.innerHTML === 'Todo' && category === 'todo'){
                node.firstChild.classList.add('active');
            }
            else if(node.firstChild.innerHTML === 'Cervezas' && category === 'cerveza'){
                node.firstChild.classList.add('active');
            }
            else if(node.firstChild.innerHTML === 'Pisco' && category === 'pisco'){
                node.firstChild.classList.add('active');
            }
            else if(node.firstChild.innerHTML === 'Vodka' && category === 'vodka'){
                node.firstChild.classList.add('active');
            }
            else if(node.firstChild.innerHTML === 'Ron' && category === 'ron'){
                node.firstChild.classList.add('active');
            }
            else if(node.firstChild.innerHTML === 'Bebidas' && category === 'bebida'){
                node.firstChild.classList.add('active');
            }
            else if(node.firstChild.innerHTML === 'Energeticas' && category === 'bebida energetica'){
                node.firstChild.classList.add('active');
            }
            else if(node.firstChild.innerHTML === 'Snacks' && category === 'snack'){
                node.firstChild.classList.add('active');
            }
        }
    });
    document.querySelector('#orden').value = 0;
}

/**
 * @param {String} category Corresponde a la categoria seleccionada en la vista (cerveza, vodka, snack, bebidas, ron, etc).
 * 
 * @Ruta_Api_Consultada 'url/filterCategory/category', siendo category el parametro de entrada.
 * 
 * @Descripcion
 *                 - Se realiza una consulta a la ApiRest con la categoria ingresada por parametro.
 *                 - Luego si la consulta es correcta se guardan los productos en la variable global 'products'
 *                 - Si no es correcta se activan los alert con el error. 
 */
function getProductosCategory(category) {
    categoryActive(category);
    starStopLoader(true);
    
    fetch(url + 'filterCategory/' + category)
        .then(response => response.json())
        .catch(error => {
            showAlert(true, 'error');
        })
        .then(data => {
            products = data;
            products_length = data.length;
            pageNumber = 1;
            showProducts();
        })
        .catch(error => {
            showAlert(true, 'error');
        });
}

/**
 * @Ruta_Api_Consultada : 'url/filterCategory/category', siendo category el parametro de entrada.
 * 
 * @Descripcion 
 *                  - Se realiza una consulta a la ApiRest
 *                  - Si la consulta es correcta los productos retornados se guardan en en la variable global 'products'
 *                    Si no es correcta se activan el alert con el error.
 */
function getProducts() {
    categoryActive('todo');
    starStopLoader(true);
    fetch(url + 'productos')
        .then(response => response.json())
        .catch(error => {
            starStopLoader(false);
            showAlert(true, 'error');
        })
        .then(data => {
            if(data) {
                products = data;
                products_length = data.length;
            }
            pageNumber = 1;
            showProducts();
        })
        .catch(error => {
            showAlert(true, 'error');
        });
}

/**
 * @Ruta_Api_Consultada 'url/search/productToSearch', siendo 'productToSearch' el valor de lo ingresado en el input del buscador.
 * 
 * @Descripcion 
 *              - Se obtiene el valor del input del buscador.
 *              - Luego realiza una consulta a la ApiRest con el valor del input.
 *              - Si la consulta es correcta se guardan los productos en la variable global 'products'.
 *                Si no es correcta se activan el alert con el error.
 */
function search(){
    showAlert(false, '');
    const productToSearch = document.querySelector('.input-search').value;

    if(productToSearch !== ''){
        starStopLoader(true);
        fetch(url + `search/${productToSearch}`)
            .then(response => response.json())
            .catch(error => {
                //console.log('Un error ha ocurrido 1' + error.message);
                showAlert(true, 'error');
            })
            .then(data => {
                products = data;
                products_length = data.length;
                pageNumber = 1;
                showProducts();
            })
            .catch(error => {
                //console.log('Un error ha ocurrido 2' + error.message);
                showAlert(true, 'error');
            });
    }
}

/**
 * @param {Array} array : corresponde al array de productos 'products'
 * @param {Number} page_size 
 * @param {Number} page_number 
 * 
 * @Descripcion Con la funcion slice se toman 12 o menos productos de la pagina seleccionada.
 * 
 * @returns Arreglo con los productos correspondiente a la pagina indicada en 'page_number'.
 */
function paginate(array, page_size, page_number){
    return array.slice((page_number - 1) * page_size, page_number * page_size);
}

/**
 * @param {Number} page : numero de la pagina seleccionada
 * 
 * @Descripcion Funcion que cambia la pagina en la paginación, provoca que se cambien los productos de la vista.
 */
function numberPage(page) {
    pageNumber = page;
    showProducts();
}

/**
 * @Descripcion Funcion que avanza una pagina en la paginación, provoca que se cambien los productos de la vista.
 */
function nextPage() {
    pageNumber++;
    showProducts();
}

/**
 * @Descripcion Funcion que retrocede una pagina en la paginación, provoca que se cambien los productos de la vista.
 */
function previusPage() {
    pageNumber--;
    showProducts();
}

/**
 * 
 * @param {Number} pageCont : cantidad de paginas de la paginacion.
 * 
 * @Descripcion Función que agrega los botones Siguiente, Anterior y Numericos de la paginación. 
*/
function createPagination(pageCont) {
    let paginationButtons = '';
    const pagination = document.querySelector('.pagination');
    paginationButtons += pageNumber > 1 ? `<button class="btn-pagination" onclick="previusPage()">
                                                <span class="material-icons">chevron_left</span>Anterior
                                            </button>` : '';
    
    for(let i = 0; i < pageCont; i++){
        if(pageNumber === i+1) paginationButtons += `<button onclick="numberPage(${i+1})" class="btn-pagination active-pag">${i+1}</button>`
        else paginationButtons += `<button onclick="numberPage(${i+1})" class="btn-pagination btn-number">${i+1}</button>`
    }

    paginationButtons += pageNumber < pageCont ?    `<button class="btn-pagination" onclick="nextPage()">Siguiente
                                                        <span s class="material-icons">chevron_right</span>
                                                    </button>` : '';
    pagination.innerHTML = '';
    pagination.innerHTML = paginationButtons;
}

/**
 * @Descripcion 
 *              - Funcion que mustra los productos en la vista. 
 *              - Por cada producto obtenido en las consultas a la Api.
 *                  - Se crean los elementos para crear un Card.
 *                  - Los Card se componen de Nombre del producto, Imagen, Precio, Descuento, Input de cantidad y Boton de agregar al carro.
 *              - Esta funcion ocupa la función 'pagination', 'createPagination' y 'starStopLoader'
 */
function showProducts() {
    showAlert(false, '')
    const productContainer = document.querySelector('.product-container');
    const pagination = paginate(products, pageSize, pageNumber);
    pageCont = Math.ceil(products_length/pageSize);
    
    productContainer.innerHTML = "";

    if(products_length === 0) {
        showAlert(true, 'empty');
    }

    pagination.forEach(product => {
        const card = document.createElement('div');

        if(product.discount > 0){
            const discount = document.createElement('div');
            discount.classList.add('discount');
            discount.innerHTML = product.discount + '%';
            card.appendChild(discount);
        }
        
        const image = document.createElement('img');
        const title = document.createElement('label');
        const price = document.createElement('label');
        const button = document.createElement('button');

        card.classList.add('card');
        image.classList.add('image');
        title.classList.add('card-title');
        price.classList.add('card-price');
        button.classList.add('btn-card');
        image.src = "https://gearsource.com/wp-content/uploads/2020/08/placeholder-768x768.jpg";
        image.loading = "lazy";
        image.alt = product.name;
        if(product.url_image){
            image.src = product.url_image;
        }
        
        title.innerHTML = product.name;
        price.innerHTML = '$' + product.price;
        button.innerHTML = 'Agregar al carro';
        button.id = `product-${product.id}`;
    
        button.addEventListener('click', function(event){
            addCar(product);
            event.preventDefault();
        });
      
        const cantidad = document.createElement('div');
        cantidad.classList.add('cantidad-input')

        const inputCantidad = document.createElement('input');
        
        inputCantidad.style.textAlign = 'center';
        inputCantidad.min = "1";
        inputCantidad.value = "1";
        inputCantidad.id = `cantidad-${product.id}`
        inputCantidad.type = 'number'

        const buttonRemove = document.createElement('button');
        buttonRemove.innerHTML = `<span class="material-icons">remove</span>`;
        buttonRemove.addEventListener('click', function() {
            cantidadRemove(product.id);
        });

        const buttonAdd = document.createElement('button');
        buttonAdd.innerHTML = `<span class="material-icons">add</span>`;
        buttonAdd.addEventListener('click', function() {
            cantidadAdd(product.id);
        });


        cantidad.appendChild(buttonRemove);
        cantidad.appendChild(inputCantidad)
        cantidad.appendChild(buttonAdd);

        card.appendChild(image);
        card.appendChild(title);
        card.appendChild(price);
        card.appendChild(cantidad);
        card.appendChild(button);
    
        productContainer.appendChild(card);
        createPagination(pageCont);
    })

    starStopLoader(false);
}

/**
 * @Descripcion Funcion que ordena los productos de acuerdo a la opción seleccionada en el select
 */
function ordenProducts() {
    const optionSelect = document.querySelector('#orden');
 
    /**Ordenar por nombre */
    if(optionSelect.selectedIndex === 0){
        products.sort((a, b) => {
            if(a.name > b.name) return 1;
            if(a.name < b.name) return -1;
            return 0;
        })
    }
    /**Precio de menor a mayor */
    else if(optionSelect.selectedIndex === 1){
        products.sort((a, b) => {
            if(a.price > b.price) return 1;
            if(a.price < b.price) return -1;
            return 0;
        })
    }
    /**Precio de mayor a menor */
    else if(optionSelect.selectedIndex === 2){
        products.sort((a, b) => {
            if(a.price < b.price) return 1;
            if(a.price > b.price) return -1;
            return 0;
        })
    }
    /**Mayor a menor descuento */
    else {
        products.sort((a, b) => {
            if(a.discount < b.discount) return 1;
            if(a.discount > b.discount) return -1;
            return 0;
        })
    }
    showProducts();
}

/**
 * 
 * @param {Boolean} val 
 * 
 * @Descripcion Funcion que activa o desactiva el loader dependiendo del valor de 'val' 
*/
function starStopLoader(val) {
    const loader = document.querySelector('.lds-dual-ring');
    /**Si val es true se activa el loader, si es false se oculta. */
    val ? loader.style.display = 'block' : loader.style.display = 'none';     
}

/**
 * 
 * @param {Boolean} val 
 * @param {String} status 
 * 
 * @Description Funcion que activa o desactiva el loader dependiendo del valor de 'val', 'status' indica cual alerta se activa. 
 * 
 */
function showAlert(val, status) {
    const alert = document.querySelector('.alert');
    val ? alert.style.display = 'block' : alert.style.display = 'none';
    if(status === 'empty')  alert.lastElementChild.innerHTML = innerHTML = 'Lo sentimos, no hay productos para mostrar.';
    else alert.lastElementChild.innerHTML = innerHTML = 'Ha ocurrido un error, vuelve a intentarlo más tarde.';
}

/**
 * 
 * @param {Object} product 
 * 
 * @Descripcion Funcion que agrega un producto al carrito de compras
 *                  - Se obtiene la cantidad seleccionada por el cliente.
 *                  - Si el producto existe en el carrito se aumenta la cantidad.
 *                  - Si no esta en el carrito, se agrega con la cantidad seleccionada. 
 *                  - Luego se calcula el total de productos que tiene el carriro.'
 *                  - Se termina el precio total de la compra.
 *                  - Los dos valores mencionados se agregan a la vista junto al boton del carrito.
 */
function addCar(product) {
    const cantidadInput = document.querySelector(`#cantidad-${product.id}`).value;   
    
    const findProductoCarrito = carrito.find(producto => producto.id === product.id);

    if(findProductoCarrito) {
        findProductoCarrito.cantidad += Number(cantidadInput);
    }
    else {
        product.cantidad = Number(cantidadInput);
        carrito.push(product);
    }
    const totalProducts = carrito.reduce( (total, current) => {
        return total + Number(current.cantidad);
    }, 0)

    const totalPrice = carrito.reduce( (total, current) => {
        return total + (Number(current.cantidad) * current.price);
    }, 0)

    document.querySelector('.shopping-products').innerHTML = totalProducts;
    document.querySelector('.shopping-total').innerHTML = `$ ${totalPrice}`;
}

/**
 * @param {Number} product_id 
 * 
 * @Descripcion Funcion que aumenta el valor del input cantidad de un producto
 */
function cantidadAdd(product_id) {
    const cantidadInput = document.querySelector(`#cantidad-${product_id}`);
    cantidadInput.value = Number(cantidadInput.value) + 1;
}   

/**
 * @param {Number} product_id 
 * 
 * @Descripcion Funcion que disminuye el valor del input cantidad de un producto.
 */
function cantidadRemove(product_id) {
    const cantidadInput = document.querySelector(`#cantidad-${product_id}`);
    cantidadInput.value = Number(cantidadInput.value) - 1;
}

getProducts();

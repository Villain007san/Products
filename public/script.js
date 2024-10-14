// Fetch products and display them in the product list
async function fetchProducts() {
    try {
        const response = await fetch('/api/products');
        const products = await response.json();

        if (response.ok) {
            displayProducts(products);
        } else {
            console.error('Failed to fetch products');
        }
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

// Display products in the product-list
function displayProducts(products) {
    const productList = document.getElementById('product-list');

    // Check if the element exists
    if (!productList) {
        console.error('Product list element not found');
        return;
    }

    // Clear existing content
    productList.innerHTML = '';

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
        productCard.innerHTML = `
            <img src="${product.image_url}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <p>Price: ₹${product.price}</p>
            <p>In Stock: ${product.quantity_in_stock}</p>
            <button class="add-to-cart" data-product-id="${product.product_id}">Add to Cart</button>
        `;
        productList.appendChild(productCard);
    });
}

// Handle form submission for adding a new product
document.getElementById('add-product-form')?.addEventListener('submit', async (event) => {
    event.preventDefault();

    const product = {
        product_id: document.getElementById('product_id').value,
        name: document.getElementById('name').value,
        description: document.getElementById('description').value,
        price: document.getElementById('price').value,
        category: document.getElementById('category').value,
        quantity_in_stock: document.getElementById('quantity_in_stock').value,
        image_url: document.getElementById('image_url').value
    };

    try {
        const response = await fetch('/api/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(product)
        });

        if (response.ok) {
            alert('Product added successfully!');
            document.getElementById('add-product-form').reset();
        } else {
            alert('Failed to add product');
        }
    } catch (error) {
        console.error('Error adding product:', error);
    }
});

// Initialize fetching products
document.addEventListener('DOMContentLoaded', fetchProducts);
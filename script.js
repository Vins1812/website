let cart = [];

let lastScrollTop = 0;
const header = document.querySelector('header');

window.addEventListener('scroll', function() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > lastScrollTop && scrollTop > 200) {
        header.classList.add('scrolled-down');
    } 
    else {
        header.classList.remove('scrolled-down');
    }
    
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
}, false);


function getProductData(productId) {
    const card = document.querySelector(`.product-card[data-id="${productId}"]`);
    if (card) {
        return {
            id: productId,
            name: card.querySelector('[data-name]').textContent,
            price: parseInt(card.querySelector('[data-price]').dataset.price),
            image: card.querySelector('img').src,
        };
    }
    return null;
}


function calculateTotal() {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function addToCart(productId) {
    const product = getProductData(productId);
    if (product) {
        const cartItem = cart.find(item => item.id === product.id);
        if (cartItem) {
            cartItem.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        renderCart();
        alert(`Berhasil menambahkan ${product.name} ke keranjang!`);
    }
}

function renderCart() {
    const cartItemsElement = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    const cartCountElement = document.getElementById('cart-count');
    
    cartItemsElement.innerHTML = '';
    let total = 0;
    let count = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        count += item.quantity;
        
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <span>${item.name} (x${item.quantity})</span>
            <span>Rp ${itemTotal.toLocaleString('id-ID')}</span>
        `;
        cartItemsElement.appendChild(listItem);
    });

    const finalTotal = calculateTotal();
    cartTotalElement.textContent = finalTotal.toLocaleString('id-ID');
    cartCountElement.textContent = count;
}


function filterProducts(filterCategory = 'all') {
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        const category = card.dataset.category;
        if (filterCategory === 'all' || category === filterCategory) {
            card.style.display = 'block'; 
        } else {
            card.style.display = 'none';
        }
    });
}



function showSection(sectionId) {
    const sections = ['hero', 'produk', 'keranjang', 'contact', 'payment']; 
    
    sections.forEach(id => {
        const section = document.getElementById(id);
        if (section) {
            section.classList.add('hidden');
        }
    });

    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.remove('hidden');
    }
    
    if (sectionId === 'hero' || sectionId === 'produk') {
        document.getElementById('produk').classList.remove('hidden');
    }
}



document.addEventListener('click', function(event) {
    if (event.target.classList.contains('add-to-cart')) {
        const productId = event.target.dataset.productId; // Mengambil ID dari tombol
        addToCart(productId);
    }
});

document.getElementById('checkout-button').addEventListener('click', function() {
    if (cart.length > 0) {
        const finalTotal = calculateTotal();
        document.getElementById('payment-total-display').textContent = finalTotal.toLocaleString('id-ID');
        showSection('payment'); 
        window.scrollTo(0, 0); 
    } else {
        alert("Keranjang Anda masih kosong!");
    }
});

document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);

        if (targetId === 'keranjang') {
            const isCartVisible = !document.getElementById('keranjang').classList.contains('hidden');
            if (isCartVisible) {
                showSection('produk'); 
            } else {
                showSection('keranjang');
            }
        } else if (targetId === 'hero') {
            showSection('hero');
        } else {
            showSection(targetId);
        }

        window.scrollTo(0, 0); 
    });
});

document.getElementById('category-filter').addEventListener('change', function() {
    filterProducts(this.value);
});


document.addEventListener('DOMContentLoaded', () => {
    filterProducts('all');
    renderCart(); 
    showSection('hero'); 
});
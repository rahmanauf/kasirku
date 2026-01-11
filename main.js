  // --- DATA AWAL (Contoh) ---
        let products = [
           { id: 1 ,name: 'Ceker Pedas ', price: 10000 },
{ id: 2 ,name: 'Ceker Pedas Manis ', price: 10000 },
{ id: 3 ,name: 'Pempek ', price: 12000 },
{ id: 4 ,name: 'Nasi Udang Selimut ', price: 15000 },
{ id: 5 ,name: 'Nasi Ayam Kipas ', price: 15000 },
{ id: 6 ,name: 'Nasi Cumi Calamari ', price: 15000 },
{ id: 7 ,name: 'Nasi Chicken Katsu Barbeque ', price: 15000 },
{ id: 8 ,name: 'Nasi Ayam Kipas Srundeng ', price: 15000 },
{ id: 9 ,name: 'Nasi Chicken Katsu Lada Hitam ', price: 15000 },
{ id: 10 ,name: 'Nasi Sayap Spacy ', price: 15000 },
{ id: 11 ,name: 'Nasi Telur Dadar ', price: 10000 },
{ id: 12 ,name: 'Nasi Usus ', price: 12000 },
{ id: 13 ,name: 'Es Teh Original ', price: 4000 },
{ id: 14 ,name: 'Es Teh Leci ', price: 7000 },
{ id: 15 ,name: 'Es Teh Melon ', price: 7000 },
{ id: 16 ,name: 'Es Teh Lemon ', price: 7000 },
{ id: 17 ,name: 'Milk Tea ', price: 8000 },
{ id: 18 ,name: 'Milk Tea Strawberry ', price: 8000 },
{ id: 19 ,name: 'Milk Tea Melon ', price: 8000 },
{ id: 20 ,name: 'Durian Milk ', price: 7000 },
{ id: 21 ,name: 'Strawberry Milk ', price: 7000 },
{ id: 22 ,name: 'Melon Milk ', price: 7000 },
{ id: 23 ,name: 'Grape Milk ', price: 7000 },
{ id: 24 ,name: 'Mango Milk ', price: 7000 },
{ id: 25 ,name: 'Chocolate Milk ', price: 7000 },
{ id: 26 ,name: 'Coffee Latte ', price: 10000 },
{ id: 27 ,name: 'Coffee latte brown sugar ', price: 12000  }

        ];

        let cart = [];

        // Format Rupiah
        const formatRupiah = (number) => {
            return new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0
            }).format(number);
        };

        // --- FUNGSI UTAMA ---

        // 1. Load Produk ke Dropdown & List Manage
        function loadProducts() {
            const select = document.getElementById('productSelect');
            const manageList = document.getElementById('manageProductList');
            
            // Reset
            select.innerHTML = '<option value="">-- Pilih Barang --</option>';
            manageList.innerHTML = '';

            products.forEach(p => {
                // Isi Dropdown
                const option = document.createElement('option');
                option.value = p.id;
                option.text = `${p.name} - ${formatRupiah(p.price)}`;
                select.appendChild(option);

                // Isi List Modal Manage
                const li = document.createElement('li');
                li.className = 'product-item-manage';
                li.innerHTML = `
                    <span>${p.name} (${formatRupiah(p.price)})</span>
                    <button class="btn-delete" onclick="deleteProduct(${p.id})">Hapus</button>
                `;
                manageList.appendChild(li);
            });
        }

        // 2. Tambah ke Keranjang
        function addToCart() {
            const select = document.getElementById('productSelect');
            const qtyInput = document.getElementById('qtyInput');
            
            const id = parseInt(select.value);
            const qty = parseInt(qtyInput.value);

            if (!id || qty < 1) {
                alert("Pilih barang dan masukkan jumlah yang benar.");
                return;
            }

            const product = products.find(p => p.id === id);
            
            // Cek apakah barang sudah ada di cart
            const existingItem = cart.find(c => c.id === id);

            if (existingItem) {
                existingItem.qty += qty;
                existingItem.total = existingItem.qty * existingItem.price;
            } else {
                cart.push({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    qty: qty,
                    total: product.price * qty
                });
            }

            // Reset input
            qtyInput.value = 1;
            renderCart();
        }

        // 3. Render Keranjang Belanja
        function renderCart() {
            const cartListEl = document.getElementById('cartList');
            const subTotalEl = document.getElementById('subTotal');
            const grandTotalEl = document.getElementById('grandTotal');
            
            cartListEl.innerHTML = '';

            let total = 0;

            if (cart.length === 0) {
                cartListEl.innerHTML = '<div style="text-align: center; color: #9ca3af; padding: 20px;">Keranjang kosong</div>';
            } else {
                cart.forEach((item, index) => {
                    total += item.total;
                    
                    const div = document.createElement('div');
                    div.className = 'cart-item';
                    div.innerHTML = `
                        <div class="item-info">
                            <span class="item-name">${item.name}</span>
                            <span class="item-price">${formatRupiah(item.price)} x ${item.qty}</span>
                        </div>
                        <div class="item-actions">
                            <strong>${formatRupiah(item.total)}</strong>
                            <button class="btn-delete" onclick="removeFromCart(${index})">🗑️</button>
                        </div>
                    `;
                    cartListEl.appendChild(div);
                });
            }

            subTotalEl.textContent = formatRupiah(total);
            grandTotalEl.textContent = formatRupiah(total);
        }

        // 4. Hapus dari Keranjang
        function removeFromCart(index) {
            cart.splice(index, 1);
            renderCart();
        }

        // --- MANAJEMEN PRODUK (CRUD SEDERHANA) ---

        function toggleModal() {
            const modal = document.getElementById('settingsModal');
            modal.style.display = (modal.style.display === 'flex') ? 'none' : 'flex';
        }

        function addNewProduct() {
            const nameInput = document.getElementById('newProductName');
            const priceInput = document.getElementById('newProductPrice');
            
            const name = nameInput.value.trim();
            const price = parseInt(priceInput.value);

            if (!name || !price) {
                alert("Nama dan Harga harus diisi!");
                return;
            }

            const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
            
            products.push({ id: newId, name: name, price: price });
            
            // Bersihkan input
            nameInput.value = '';
            priceInput.value = '';
            
            loadProducts(); // Refresh dropdown
            alert("Barang berhasil ditambahkan!");
        }

        function deleteProduct(id) {
            if(confirm("Yakin ingin menghapus barang ini?")) {
                products = products.filter(p => p.id !== id);
                loadProducts();
            }
        }

        // --- FUNGSI PRINT ---

        function printReceipt() {
            if (cart.length === 0) {
                alert("Keranjang masih kosong!");
                return;
            }

            // Ambil Nama Pelanggan
            const customerNameInput = document.getElementById('customerNameInput');
            const customerName = customerNameInput.value.trim() || "Umum"; // Jika kosong, tulis "Umum"
            const printCustomerName = document.getElementById('printCustomerName');
            printCustomerName.textContent = "Pelanggan: " + customerName;

            const printItems = document.getElementById('printItems');
            const printTotal = document.getElementById('printTotal');
            const printDate = document.getElementById('printDate');
            
            // Generate HTML untuk struk
            let html = '';
            let total = 0;

            cart.forEach(item => {
                html += `
                    <div class="struk-item">
                        <span>${item.name} x${item.qty}</span>
                        <span>${formatRupiah(item.total)}</span>
                    </div>
                `;
                total += item.total;
            });

            printItems.innerHTML = html;
            printTotal.textContent = formatRupiah(total);
            
            // Set Tanggal
            const now = new Date();
            printDate.textContent = now.toLocaleDateString('id-ID') + ' ' + now.toLocaleTimeString('id-ID');

            // Trigger Print Browser
            window.print();
        }

        // Inisialisasi awal
        loadProducts();

   
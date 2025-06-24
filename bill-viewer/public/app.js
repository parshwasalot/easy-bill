// Initialize Firebase with complete config but minimal permissions
const firebaseConfig = {
  apiKey: "AIzaSyAHKvRWG8AWpOVVtEUwo3RIOWDxvJMuDFo",
  authDomain: "saree-shop-app.firebaseapp.com",
  projectId: "saree-shop-app",
  storageBucket: "saree-shop-app.firebasestorage.app",
  messagingSenderId: "1090924954331",
  appId: "1:1090924954331:web:03b329d6b07ae17ab3c2fe"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

function getBillIdentifier() {
  // First check query parameters for backward compatibility
  const params = new URLSearchParams(window.location.search);
  const queryId = params.get('id');
  if (queryId) {
    return { type: 'oldId', value: queryId };
  }

  // Then check path
  const pathParts = window.location.pathname.split('/');
  const identifier = pathParts[pathParts.length - 1];
  
  if (!identifier || identifier === 'index.html') {
    return { type: 'invalid', value: null };
  }

  // Check if it's a new format hash (8 characters alphanumeric)
  if (/^[0-9a-z]{8}$/.test(identifier)) {
    return { type: 'hash', value: identifier };
  }
  
  // Must be old format ID (ddMMyyNN-NN)
  return { type: 'oldId', value: identifier };
}

async function fetchBillData() {
  try {
    const { type, value } = getBillIdentifier();
    if (!value) throw new Error('No bill identifier provided');

    let billDoc;
    
    switch (type) {
      case 'hash':
        // New format - search by urlHash
        const hashQuery = await db.collection('bills')
          .where('urlHash', '==', value)
          .limit(1)
          .get();
        
        if (!hashQuery.empty) {
          billDoc = hashQuery.docs[0];
        }
        break;

      case 'oldId':
      case 'id':
        // Try direct fetch first (for old format)
        billDoc = await db.collection('bills').doc(value).get();
        
        // If not found, try searching in the old format collection
        if (!billDoc.exists) {
          const oldBillDoc = await db.collection('old_bills').doc(value).get();
          if (oldBillDoc.exists) {
            billDoc = oldBillDoc;
          }
        }
        break;

      default:
        throw new Error('Invalid bill identifier format');
    }

    if (!billDoc || !billDoc.exists) {
      throw new Error('Bill not found');
    }

    const billData = billDoc.data();
    console.log('Successfully fetched bill data:', billData);

    // Fetch shop details
    const shopDoc = await db.collection('shop').doc('details').get();
    if (!shopDoc.exists) {
      throw new Error('Shop details not found');
    }
    
    const shopData = shopDoc.data();
    return {
      ...billData,
      shop: shopData
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}

function renderBill(data) {
    const billHtml = `
        <div class="company-header">
            ${data.shop.logo ? `<img src="${data.shop.logo}" alt="${data.shop.name}" class="company-logo">` : ''}
            <h2>${data.shop.name}</h2>
            <p>${data.shop.address || ''}</p>
            <p>Phone: ${data.shop.phone || ''} ${data.shop.gst ? `| GST: ${data.shop.gst}` : ''}</p>
        </div>

        <div class="bill-details">
            <div>
                <h3>Bill Details</h3>
                <p>Bill #: ${data.id}</p>
                <p>Date: ${data.date ? new Date(data.date.seconds * 1000).toLocaleDateString() : 'N/A'}</p>
            </div>
            <div>
                <h3>Customer Details</h3>
                <p>Name: ${data.customerName || 'N/A'}</p>
                <p>Phone: ${data.customerPhone || 'N/A'}</p>
            </div>
        </div>

        <table class="items-table">
            <thead>
                <tr>
                    <th>Item</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                ${data.items.map(item => `
                    <tr>
                        <td>${item.name}</td>
                        <td>${item.quantity}</td>
                        <td>₹${item.price}</td>
                        <td>₹${item.quantity * item.price}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>

        <div class="total-section">
            <h3>Grand Total: ₹${data.totalAmount}</h3>
            <p>Payment Mode: ${data.paymentMode || 'N/A'}</p>
        </div>

        <div class="thank-you">
            <p>NO RETURN. NO EXCHANGE. NO GUARANTEE.</p>
            <p>Thank you for shopping with us!</p>
        </div>
    `;

    document.getElementById('billContent').innerHTML = billHtml;
}

async function initializeBill() {
    const billId = getBillIdentifier().value;
    console.log('Bill ID:', billId);

    if (!billId) {
        document.getElementById('billContent').innerHTML = 'Invalid Bill ID';
        return;
    }

    try {
        console.log('Fetching bill data...');
        const billData = await fetchBillData(billId);
        console.log('Bill data received:', billData);
        renderBill(billData);
    } catch (error) {
        console.error('Detailed error:', error);
        document.getElementById('billContent').innerHTML = `Error: ${error.message}`;
    }
}

// Test security rules
async function testSecurity() {
  try {
    // This should work
    const billDoc = await db.collection('bills').doc('some-bill-id').get();
    console.log('Bill access:', billDoc.exists ? 'Success' : 'Not found');

    // This should work
    const shopDoc = await db.collection('shop').doc('details').get();
    console.log('Shop access:', shopDoc.exists ? 'Success' : 'Not found');

    // This should fail
    const otherDoc = await db.collection('other').doc('something').get();
    console.log('Should not see this');
  } catch (error) {
    console.error('Security test error:', error);
  }
}

// Run the test
testSecurity();

// Initialize when page loads
document.addEventListener('DOMContentLoaded', initializeBill);
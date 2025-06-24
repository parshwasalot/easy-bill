// Your Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyAHKvRWG8AWpOVVtEUwo3RIOWDxvJMuDFo",
  authDomain: "saree-shop-app.firebaseapp.com",
  databaseURL: "https://saree-shop-app-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "saree-shop-app",
  storageBucket: "saree-shop-app.firebasestorage.app",
  messagingSenderId: "1090924954331",
  appId: "1:1090924954331:web:03b329d6b07ae17ab3c2fe",
  measurementId: "G-YLL31BLPCS"
};

function backupFirebaseToSheets() {
  // Create folders with date
  const today = new Date();
  const folderName = `Backup_${today.toISOString().split('T')[0]}`;
  const folder = DriveApp.createFolder(folderName);
  
  // Collections to backup
  const collections = ['bills', 'customers', 'trash'];
  
  collections.forEach(collection => {
    const url = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/${collection}`;
    const response = UrlFetchApp.fetch(url, {
      headers: {
        Authorization: `Bearer ${getFirebaseToken()}`
      }
    });
    
    const data = JSON.parse(response.getContentText());
    const documents = data.documents || [];
    
    // Convert to spreadsheet format
    const sheet = SpreadsheetApp.create(`${collection}_${today.toISOString().split('T')[0]}`);
    const activeSheet = sheet.getActiveSheet();
    
    if (documents.length > 0) {
      // Define headers manually for bills collection
      let headers = [];
      if (collection === 'bills') {
        headers = ['id', 'customerName', 'customerPhone', 'date', 'paymentMode', 'totalAmount', 'items'];
      } else {
        headers = Object.keys(documents[0].fields);
      }
      
      activeSheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      
      // Extract and format data
      const values = documents.map(doc => {
        return headers.map(header => {
          const field = doc.fields[header];
          if (!field) return '';
          
          // Special handling for known number fields
          if (header === 'totalAmount') {
            return Number(field.integerValue || field.doubleValue || field.numberValue || 0);
          }
          
          // Handle different field types
          if (field.stringValue) return field.stringValue;
          if (field.timestampValue) return new Date(field.timestampValue);
          if (field.arrayValue) {
            // Format items array as JSON string
            const items = field.arrayValue.values.map(item => {
              const itemObj = {};
              Object.keys(item.mapValue.fields).forEach(key => {
                const val = item.mapValue.fields[key];
                // Explicitly handle numbers in items
                if (key === 'price' || key === 'quantity') {
                  itemObj[key] = Number(val.integerValue || val.doubleValue || val.numberValue || 0);
                } else {
                  itemObj[key] = val.stringValue || '';
                }
              });
              return itemObj;
            });
            return JSON.stringify(items);
          }
          return field.integerValue || field.doubleValue || field.numberValue || field.stringValue || '';
        });
      });
      
      if (values.length > 0) {
        activeSheet.getRange(2, 1, values.length, headers.length).setValues(values);
      }

      // Auto-size columns
      headers.forEach((_, index) => {
        activeSheet.autoResizeColumn(index + 1);
      });
    }
    
    // Move file to backup folder
    DriveApp.getFileById(sheet.getId()).moveTo(folder);
  });
  
  // Send email notification
  MailApp.sendEmail({
    to: "parshwasalot@gmail.com",
    subject: "Firebase Backup Complete",
    body: `Backup completed on ${today.toLocaleString()}\nFolder: ${folderName}`
  });
}

// Add this function to get Firebase token
function getFirebaseToken() {
  const scriptProperties = PropertiesService.getScriptProperties();
  const email = scriptProperties.getProperty('FIREBASE_EMAIL');
  const password = scriptProperties.getProperty('FIREBASE_PASSWORD');
  
  // Firebase Auth REST API endpoint
  const signInUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${firebaseConfig.apiKey}`;
  
  try {
    const response = UrlFetchApp.fetch(signInUrl, {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify({
        email: email,
        password: password,
        returnSecureToken: true
      })
    });
    
    const data = JSON.parse(response.getContentText());
    return data.idToken; // This is your Firebase auth token
  } catch (error) {
    Logger.log('Authentication failed: ' + error);
    throw new Error('Failed to get Firebase token');
  }
}

// Create time-based trigger
function createWeeklyTrigger() {
  // Delete existing triggers first to avoid duplicates
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => ScriptApp.deleteTrigger(trigger));
  
  // Create new monthly trigger
  ScriptApp.newTrigger('backupFirebaseToSheets')
    .timeBased()
    .onMonthDay(1)  // Runs on 1st of every month
    .atHour(0)      // At midnight
    .create();
}
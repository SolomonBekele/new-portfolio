// Open (or create) IndexedDB
const request = indexedDB.open("MyDatabase", 1);

request.onupgradeneeded = function (event) {
  const db = event.target.result;
  
  // Create the users store only once
  if (!db.objectStoreNames.contains("users")) {
    const objectStore = db.createObjectStore("users", {
      keyPath: "id",
      autoIncrement: true
    });

    // Create unique index on email
    objectStore.createIndex("email", "email", { unique: true });

    console.log("Database setup complete with unique email!");
  }
};

request.onsuccess = function (event) {
  const db = event.target.result;

  // Function to safely add user (no duplicates)
  function addUser(user) {
    const transaction = db.transaction("users", "readwrite");
    const store = transaction.objectStore("users");
    const emailIndex = store.index("email");

    // Check if email already exists
    const emailCheck = emailIndex.get(user.email);

    emailCheck.onsuccess = function () {
      if (emailCheck.result) {
        console.warn("⚠️ User already exists with this email:", user.email);
      } else {
        const addRequest = store.add(user);
        addRequest.onsuccess = function () {
          console.log("✅ User added successfully!");
        };
        addRequest.onerror = function (event) {
          console.error("❌ Error adding user:", event.target.error);
        };
      }
    };

    emailCheck.onerror = function (event) {
      console.error("❌ Error checking email:", event.target.error);
    };
  }

  // Example usage
  const newUser = { name: "Solomon Bekele", email: "solomon@example.com" };
  addUser(newUser);
};

request.onerror = function (event) {
  console.error("Database error:", event.target.error);
};

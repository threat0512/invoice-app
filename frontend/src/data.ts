export interface UserProfile {
  id: string
  username: string,
  email: string,
  password: string,
  savedTags: string[]
  accountType: string
}

export interface EInvoice {
  belongsTo: string
  name: string,
  data: string
}

export interface EInvoiceItem {
  id: string,
  name: string,
  checked: boolean,
  pdfGenMsg: 'generate pdf' | 'fetching xml...' | 'generating...' | 'an error occured :(',
  tags: string[],
  index: number,
  shown: boolean
}

export function arraysEqual(arr1: string[], arr2: string[]) {
  // Check if the arrays have the same length
  if (arr1.length !== arr2.length) {
      return false;
  }
  
  // Sort the arrays to ensure elements are in the same order
  const sortedArr1 = arr1.slice().sort();
  const sortedArr2 = arr2.slice().sort();
  
  // Iterate over one array and check if each element exists in the other array
  for (let i = 0; i < sortedArr1.length; i++) {
      if (sortedArr1[i] !== sortedArr2[i]) {
          return false;
      }
  }
  
  return true;
}

// export function getInvoicesBelongingTo(id: string): EInvoice[] {
//   return E_INVOICES.filter(i => i.belongsTo === id);
// }

// export function logInAndGetUser(username: string, password: string) {
//   // if using database, will have to deal with encryption here...
//   const u = USERS.find(u => u.username === username && u.password === password);
//   if (u == null) return null
//   return { ...u };
// }

// export function registerUser(username: string, email: string, password: string, accountType: string): UserProfile | null {
//   // Check if the username or email is already taken
//   if (USERS.some(user => user.username === username || user.email === email)) {
//     return null; // Return null if username or email is already taken
//   }

//   // Generate a unique ID for the new user
//   const id = globalId.toString();
//   globalId++;

//   // Create a new user object
//   const newUser: UserProfile = {
//     id,
//     username,
//     email,
//     password,
//     accountType,
//   };

//   USERS.push(newUser);

//   return newUser;
// }

// export const USERS: UserProfile[] = [
//   {
//     id: '0',
//     username: 'user1',
//     email: 'user1@example.com',
//     password: 'pass1'
//   },
//   {
//     id: '1',
//     username: 'user2',
//     email: 'user2@example.com',
//     password: 'pass2'
//   },
// ];

// export const E_INVOICES: EInvoice[] = [
//   {
//     belongsTo: '0',
//     name: 'Invoice 001',
//     data: `
//       <invoice>
//         <id>001</id>
//         <date>2024-03-21</date>
//         <total>100.00</total>
//       </invoice>
//     `
//   },
//   {
//     belongsTo: '0',
//     name: 'Invoice 002',
//     data: `
//       <invoice>
//         <id>002</id>
//         <date>2024-03-22</date>
//         <total>150.00</total>
//       </invoice>
//     `
//   },
//   {
//     belongsTo: '1',
//     name: 'Invoice 003',
//     data: `
//       <invoice>
//         <id>003</id>
//         <date>2024-03-23</date>
//         <total>200.00</total>
//       </invoice>
//     `
//   },
//   {
//     belongsTo: '1',
//     name: 'Invoice 004',
//     data: `
//       <invoice>
//         <id>003</id>
//         <date>2024-03-23</date>
//         <total>200.00</total>
//       </invoice>
//     `
//   }
// ];

// export function getInvoicesBelongingTo(id: string): EInvoice[] {
//   return E_INVOICES.filter(i => i.belongsTo === id);
// }

// export function logInAndGetUser(username: string, password: string) {
//   // if using database, will have to deal with encryption here...
//   const u = USERS.find(u => u.username === username && u.password === password);
//   if (u == null) return null
//   return { ...u };
// }

// export function registerUser(username: string, email: string, password: string): UserProfile | null {
//   // Check if the username or email is already taken
//   if (USERS.some(user => user.username === username || user.email === email)) {
//     return null; // Return null if username or email is already taken
//   }

//   // Generate a unique ID for the new user
//   const id = globalId.toString();
//   globalId++;

//   // Create a new user object
//   const newUser: UserProfile = {
//     id,
//     username,
//     email,
//     password
//   };

//   USERS.push(newUser);

//   return newUser;
// }

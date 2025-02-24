# **GitHub Repository Explorer**  

A **Next.js** web application that allows users to search for GitHub repositories by username, view repository details, and explore contributors.  

## **Features**  
✅ Search for repositories by GitHub username  
✅ Infinite scrolling to load more repositories dynamically  
✅ Sort repositories by star count (ascending/descending)  
✅ View repository details (name, description, language, stars, last updated)  
✅ View top contributors (cached for efficiency)  
✅ Dark mode toggle  
✅ Optimized API calls with caching  
✅ Back button restores previous search results  

## **Installation & Setup**  
### **1️⃣ Clone the Repository**  
```bash
git clone https://github.com/DenisSkulovic/repo_viewer.git
cd repo_viewer
```
### **2️⃣ Install Dependencies**  
```bash
npm install
```
### **3️⃣ Run the Development Server**  
```bash
npm run dev
```
The application will be available at **`http://localhost:3000`**  

## **Usage**  
1️⃣ Enter a GitHub username in the search bar and click **Search**  
2️⃣ Scroll down to load more repositories dynamically  
3️⃣ Click a repository to view its details  
4️⃣ Check the list of top contributors  
5️⃣ Click **Sort by Stars** to reorder repositories  
6️⃣ Toggle **Dark Mode**  
7️⃣ Use the **Back** button to return to previous results  

## **Technical Details**  
- **Framework:** Next.js (React)  
- **State Management:** Redux Toolkit  
- **Styling:** SCSS (No Bootstrap)  
- **GitHub API:** Used for repositories & contributors  
- **Caching:** LocalStorage for API response optimization  
- **Infinite Scrolling:** Implemented using Intersection Observer  

## **Caching Mechanism**  
- **Repositories and contributors are cached** in localStorage to reduce unnecessary API requests  
- **Cached data is used on page reload** to restore the previous state  

## **Important Notes**  
- **If a repository has only one contributor (the owner), GitHub API does not return any contributors**  
- **API calls are rate-limited** (consider using a VPN if blocked)  
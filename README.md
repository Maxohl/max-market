# Max Market by Maxohl

Hello! This is a personal side project I made in my spare hours. I wanted to challenge myself by working on something new and slightly complex and I thought a page like 'Mercado Livre' would be a good way to do it.

I made this using React and MongoDB as the main focus, the reason being that I never had a good chance to really use the two of them together in a project of this magnitude.

## Current Functionalities

- Registration and Login
- Authentication required for certain pages
- Profile page
  - Change address
  - See products that user purchased
  - Sell products
  - Manage offers for each product
  - See sales and change the status of the product (e.g., 'Processing', 'Shipped', 'Delivered', and 'Cancelled')
- Home page showing all products being sold, displaying 10 items per page to demonstrate pagination
- If available, user can choose color and size of product, as well as view several pictures if provided by the seller
- Items can be added to Cart
- In the Cart page, user can confirm the purchase information, address, and choose a payment method (currently no real payment method implemented)
- Once a purchase is finalized, both the buyer and seller can see the status of the transaction in their profiles
- Categories button displays the top 5 categories; clicking one shows all products in that category
- Search bar allows searching products by name or category
- Offers button displays all products currently on offer

## Pictures

Home page
![Screenshot Home page](https://raw.githubusercontent.com/Maxohl/max-market/main/public/image.png)

Viewing Product
![View Product Screenshot](https://raw.githubusercontent.com/Maxohl/max-market/main/public/ViewProduct.png)

## Installation

To run this project locally, follow these steps:

1. **Clone the Repository**  
   Clone the repository to your local machine:
   ```bash
   git clone https://github.com/your-username/max-market.git
   ```

2. **Navigate to the Project Directory**  
   Change to the project directory:
   ```bash
   cd max-market
   ```

3. **Install Dependencies**  
   Install the required dependencies for the frontend:
   ```bash
   npm install
   ```

4. **Set Up the Backend**  
   Navigate to the backend folder and install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

5. **Run the Backend**  
   Start the backend server:
   ```bash
   node index.js
   ```

6. **Run the Frontend**  
   In a new terminal, navigate back to the main project folder and start the frontend:
   ```bash
   cd ..
   npm run dev
   ```

7. **Access the Application**  
   Open your browser and go to `http://localhost:5173` (or the port shown in the terminal after running `npm run dev`).

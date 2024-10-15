# City Spark

City Spark is a modern e-commerce platform built with Next.js, focusing on plumbing and heating products. It offers a seamless shopping experience with features like product categorization, search functionality, and a user-friendly cart system.

## Features

- **Dynamic Product Catalog**: Browse through a wide range of plumbing and heating products organized in a hierarchical category structure.
- **Advanced Search**: Quickly find products with an intelligent search feature including autocomplete suggestions.
- **Responsive Design**: Enjoy a consistent shopping experience across desktop and mobile devices.
- **User Authentication**: Secure login and registration system with options for social login.
- **Shopping Cart**: Easy-to-use cart functionality with real-time updates.
- **Admin Dashboard**: Comprehensive admin panel for managing products, categories, and inventory.
- **SEO Optimized**: Built with SEO best practices to improve visibility in search engines.

## Tech Stack

- **Frontend**: Next.js, React
- **Backend**: Node.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **State Management**: React Query, Zustand
- **Styling**: Tailwind CSS, Radix UI
- **Icons**: Lucide React
- **Form Handling**: React Hook Form with Zod validation
- **API**: RESTful API built with Next.js API routes

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- Yarn package manager
- PostgreSQL database

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-username/city-spark.git
   ```

2. Navigate to the project directory:
   ```
   cd city-spark
   ```

3. Install dependencies:
   ```
   yarn install
   ```

4. Set up environment variables:
   - Copy `.env.example` to `.env.local`
   - Fill in the required environment variables

5. Set up the database:
   ```
   npx prisma generate
   npx prisma db push
   ```

6. Run the development server:
   ```
   yarn dev
   ```

7. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

- `/app`: Next.js app router and page components
- `/components`: Reusable React components
- `/lib`: Utility functions and shared logic
- `/prisma`: Database schema and migrations
- `/public`: Static assets
- `/styles`: Global styles and Tailwind CSS configuration

## Contributing

We welcome contributions to City Spark! Please read our [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Prisma](https://www.prisma.io/)
- [Radix UI](https://www.radix-ui.com/)

## Contact

For any queries or support, please contact us at support@cityspark.com.

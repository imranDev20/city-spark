import Link from "next/link";
import React from "react";

const StorefrontFooter: React.FC = () => {
  return (
    <footer className="bg-gray-100 py-12 dark:bg-gray-800">
      <div className="container grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4 lg:gap-12">
        <div className="flex flex-col items-start gap-4">
          <Link href="#">
            <a className="flex items-center gap-2">
              <MountainIcon className="h-6 w-6" />
              <span className="text-lg font-semibold">Acme Store</span>
            </a>
          </Link>
          <p className="text-gray-500 dark:text-gray-400">
            Your one-stop shop for quality products.
          </p>
          <div className="flex items-center gap-2">
            <PhoneIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <span className="text-gray-500 dark:text-gray-400">
              +1 (555) 555-5555
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MailOpenIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <span className="text-gray-500 dark:text-gray-400">
              support@acmestore.com
            </span>
          </div>
        </div>
        <div className="grid gap-2">
          <h4 className="text-lg font-semibold">Shop</h4>
          <Link href="#">
            <a className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50">
              All Products
            </a>
          </Link>
          <Link href="#">
            <a className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50">
              Clothing
            </a>
          </Link>
          <Link href="#">
            <a className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50">
              Electronics
            </a>
          </Link>
          <Link href="#">
            <a className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50">
              Home & Garden
            </a>
          </Link>
        </div>
        <div className="grid gap-2">
          <h4 className="text-lg font-semibold">Company</h4>
          <Link href="#">
            <a className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50">
              About Us
            </a>
          </Link>
          <Link href="#">
            <a className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50">
              Careers
            </a>
          </Link>
          <Link href="#">
            <a className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50">
              Blog
            </a>
          </Link>
          <Link href="#">
            <a className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50">
              Contact
            </a>
          </Link>
        </div>
        <div className="grid gap-2">
          <h4 className="text-lg font-semibold">Legal</h4>
          <Link href="#">
            <a className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50">
              Terms of Service
            </a>
          </Link>
          <Link href="#">
            <a className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50">
              Privacy Policy
            </a>
          </Link>
          <Link href="#">
            <a className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50">
              Refund Policy
            </a>
          </Link>
          <Link href="#">
            <a className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50">
              Shipping Info
            </a>
          </Link>
        </div>
      </div>
    </footer>
  );
};

const MailOpenIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21.2 8.4c.5.38.8.97.8 1.6v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V10a2 2 0 0 1 .8-1.6l8-6a2 2 0 0 1 2.4 0l8 6Z" />
    <path d="m22 10-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 10" />
  </svg>
);

const MountainIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
  </svg>
);

const PhoneIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

export default StorefrontFooter;

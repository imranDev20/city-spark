"use client";

import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { MessageCircleQuestion, Search } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    id: 1,
    category: "Payment",
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers. All payments are processed securely through our payment gateway.",
  },
  {
    id: 2,
    category: "Payment",
    question: "When will my card be charged?",
    answer:
      "Your card will be charged immediately upon placing your order. For pre-orders or back-ordered items, you'll only be charged when the item ships.",
  },
  {
    id: 3,
    category: "Payment",
    question: "Do you offer trade accounts?",
    answer:
      "Yes, we offer trade accounts for verified businesses. Trade accounts come with exclusive pricing and extended payment terms. Please contact our trade team to apply.",
  },
  {
    id: 4,
    category: "Shipping",
    question: "What are your delivery timeframes?",
    answer:
      "Standard delivery takes 2-4 working days within the UK. Next-day delivery is available for orders placed before 2 PM Monday to Friday. Delivery times may vary for remote locations.",
  },
  {
    id: 5,
    category: "Shipping",
    question: "Do you ship to remote areas?",
    answer:
      "Yes, we deliver to all UK addresses including remote areas and islands. Additional delivery charges may apply for certain postcodes, which will be clearly shown at checkout.",
  },
  {
    id: 6,
    category: "Shipping",
    question: "Can I track my delivery?",
    answer:
      "Yes, you'll receive a tracking number via email once your order is dispatched. You can use this to track your delivery on our website or directly with the courier.",
  },
  {
    id: 7,
    category: "Returns",
    question: "What is your returns policy?",
    answer:
      "We offer a 30-day return policy for unused items in their original packaging. Please contact our customer service team to initiate a return. Return shipping costs may apply unless the item is faulty.",
  },
  {
    id: 8,
    category: "Returns",
    question: "How do I return a faulty item?",
    answer:
      "For faulty items, please contact us immediately. We'll arrange a free collection and replacement. Please don't install faulty items as this may void your warranty.",
  },
  {
    id: 9,
    category: "Returns",
    question: "How long do refunds take?",
    answer:
      "Once we receive your return, refunds typically process within 3-5 working days. The funds may take an additional 3-5 working days to appear in your account, depending on your bank.",
  },
  {
    id: 10,
    category: "Installation",
    question: "Do you offer installation services?",
    answer:
      "Yes, we offer professional installation services for most of our products. Installation costs vary depending on the product and your location. Please contact us for a quote.",
  },
  {
    id: 11,
    category: "Installation",
    question: "What's included in the installation service?",
    answer:
      "Our installation service includes removal of old appliances, installation of new items, testing, and debris removal. All work is carried out by certified professionals.",
  },
  {
    id: 12,
    category: "Installation",
    question: "Do I need to prepare anything for installation?",
    answer:
      "Yes, please ensure clear access to the installation area and that any required utilities (water, gas, electricity) are available. Our team will provide specific preparation instructions when booking.",
  },
  {
    id: 13,
    category: "Products",
    question: "Do you offer warranty on your products?",
    answer:
      "Yes, all our products come with a minimum 12-month warranty. Many items have extended warranties of up to 10 years. Specific warranty information is listed on each product page.",
  },
  {
    id: 14,
    category: "Products",
    question: "Can you source products not shown on your website?",
    answer:
      "Yes, we can often source specific products or alternatives not shown on our website. Please contact our sales team with your requirements.",
  },
  {
    id: 15,
    category: "Products",
    question: "Do you offer spare parts?",
    answer:
      "Yes, we stock spare parts for most products we sell. Contact our parts department with your product model number for availability and pricing.",
  },
  {
    id: 16,
    category: "Account",
    question: "How do I create an account?",
    answer:
      "You can create an account by clicking the 'Register' button in the top right corner of our website. Follow the prompts to enter your details and create your password.",
  },
  {
    id: 17,
    category: "Account",
    question: "How do I reset my password?",
    answer:
      "Click 'Forgot Password' on the login page, enter your email address, and we'll send you instructions to reset your password. The reset link expires after 24 hours.",
  },
  {
    id: 18,
    category: "Account",
    question: "Can I view my order history?",
    answer:
      "Yes, once logged in, you can view your complete order history, including invoices and tracking information, in the 'My Orders' section of your account.",
  },
];

const FAQPage = () => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [filteredFaqs, setFilteredFaqs] = React.useState(faqs);

  React.useEffect(() => {
    const filtered = faqs.filter(
      (faq) =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredFaqs(filtered);
  }, [searchQuery]);

  const groupedFaqs = React.useMemo(() => {
    return filteredFaqs.reduce((acc, faq) => {
      if (!acc[faq.category]) {
        acc[faq.category] = [];
      }
      acc[faq.category].push(faq);
      return acc;
    }, {} as Record<string, typeof faqs>);
  }, [filteredFaqs]);

  return (
    <main className="min-h-screen bg-background py-12 lg:py-20">
      <div className="container max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">How can we help?</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find answers to common questions about our products, services, and
            policies
          </p>
        </div>

        {/* Search */}
        <div className="max-w-xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search for answers..."
              className="pl-10 h-12 bg-background border-gray-200 bg-white shadow"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* FAQ Categories */}
        {Object.entries(groupedFaqs).length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No matching questions found
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedFaqs).map(([category, categoryFaqs]) => (
              <div
                key={category}
                className="bg-white shadow rounded-lg border p-6"
              >
                <h2 className="text-xl font-semibold mb-4">{category}</h2>
                <Accordion type="single" collapsible>
                  {categoryFaqs.map((faq, index) => (
                    <AccordionItem
                      key={faq.id}
                      value={`item-${faq.id}`}
                      className={cn(
                        // Remove border from last item
                        index === categoryFaqs.length - 1 && "border-b-0"
                      )}
                    >
                      <AccordionTrigger className="text-left text-base hover:no-underline">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default FAQPage;

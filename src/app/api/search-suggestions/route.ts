import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Prisma } from "@prisma/client";

const searchSchema = z.object({
  term: z.string().trim().min(1).max(100).nullable(),
});

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const term = searchParams.get("term");

    const validatedParams = searchSchema.safeParse({ term });

    if (!validatedParams.success) {
      return NextResponse.json(
        { error: "Invalid search term" },
        { status: 400 }
      );
    }

    const { term: validTerm } = validatedParams.data;

    // If no search term, return empty results
    if (!validTerm) {
      return NextResponse.json({
        brands: [],
        categories: [],
        products: [],
      });
    }

    // Split search terms to handle multi-word searches
    const searchTerms = validTerm.toLowerCase().split(/\s+/).filter(Boolean);

    // Search brands with proper types for Prisma
    const brands = await prisma.brand.findMany({
      where: {
        OR: [
          // Exact match prioritized
          { name: { equals: validTerm, mode: Prisma.QueryMode.insensitive } },
          // Match each word separately in name
          ...searchTerms.map((term) => ({
            name: { contains: term, mode: Prisma.QueryMode.insensitive },
          })),
          // Additional fields with proper typing
          ...searchTerms.map((term) => ({
            description: { contains: term, mode: Prisma.QueryMode.insensitive },
          })),
          // Country of origin needs to handle null values properly
          ...searchTerms.map((term) => ({
            countryOfOrigin: {
              contains: term,
              mode: Prisma.QueryMode.insensitive,
            },
          })),
        ],
      },
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        name: true,
        image: true,
        countryOfOrigin: true,
        _count: {
          select: {
            products: true,
          },
        },
      },
      take: 3,
    });

    // Search categories
    const categories = await prisma.category.findMany({
      where: {
        OR: [
          { name: { equals: validTerm, mode: Prisma.QueryMode.insensitive } },
          ...searchTerms.map((term) => ({
            name: { contains: term, mode: Prisma.QueryMode.insensitive },
          })),
        ],
      },
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        name: true,
        type: true,
        image: true,
        _count: {
          select: {
            primaryProducts: true,
            secondaryProducts: true,
            tertiaryProducts: true,
            quaternaryProducts: true,
          },
        },
      },
      take: 3,
    });

    // For products, we need to use proper Prisma types
    const productsQuery = await prisma.inventory.findMany({
      where: {
        OR: [
          // HIGH PRIORITY: Exact match on product name
          {
            product: {
              name: { equals: validTerm, mode: Prisma.QueryMode.insensitive },
            },
          },
          // HIGH PRIORITY: Brand name + product name matches
          ...(searchTerms.length > 0
            ? [
                {
                  product: {
                    AND: [
                      {
                        brand: {
                          name: {
                            contains: searchTerms[0],
                            mode: Prisma.QueryMode.insensitive,
                          },
                        },
                      },
                      {
                        name: {
                          contains:
                            searchTerms.slice(1).join(" ") || searchTerms[0],
                          mode: Prisma.QueryMode.insensitive,
                        },
                      },
                    ],
                  },
                },
              ]
            : []),
          // MEDIUM PRIORITY: Any word in product name
          {
            product: {
              OR: searchTerms.map((term) => ({
                name: { contains: term, mode: Prisma.QueryMode.insensitive },
              })),
            },
          },
          // MEDIUM PRIORITY: Any word in brand name
          {
            product: {
              brand: {
                name: {
                  contains: validTerm,
                  mode: Prisma.QueryMode.insensitive,
                },
              },
            },
          },
          // LOWER PRIORITY: Words in product details
          {
            product: {
              OR: [
                // Model can be null, so handle properly
                ...searchTerms.map((term) => ({
                  model: { contains: term, mode: Prisma.QueryMode.insensitive },
                })),
                // Type can be null
                ...searchTerms.map((term) => ({
                  type: { contains: term, mode: Prisma.QueryMode.insensitive },
                })),
                // Description can be null
                ...searchTerms.map((term) => ({
                  description: {
                    contains: term,
                    mode: Prisma.QueryMode.insensitive,
                  },
                })),
                // Features is an array
                { features: { hasSome: searchTerms } },
              ],
            },
          },
          // LOWER PRIORITY: Words in template fields
          {
            product: {
              productTemplate: {
                fields: {
                  some: {
                    fieldValue: {
                      contains: validTerm,
                      mode: Prisma.QueryMode.insensitive,
                    },
                  },
                },
              },
            },
          },
          // LOWER PRIORITY: Words in categories
          {
            product: {
              OR: [
                {
                  primaryCategory: {
                    name: {
                      contains: validTerm,
                      mode: Prisma.QueryMode.insensitive,
                    },
                  },
                },
                {
                  secondaryCategory: {
                    name: {
                      contains: validTerm,
                      mode: Prisma.QueryMode.insensitive,
                    },
                  },
                },
                {
                  tertiaryCategory: {
                    name: {
                      contains: validTerm,
                      mode: Prisma.QueryMode.insensitive,
                    },
                  },
                },
                {
                  quaternaryCategory: {
                    name: {
                      contains: validTerm,
                      mode: Prisma.QueryMode.insensitive,
                    },
                  },
                },
              ],
            },
          },
        ],
      },
      select: {
        id: true,
        stockCount: true,
        heldCount: true,
        deliveryEligibility: true,
        collectionEligibility: true,
        product: {
          select: {
            id: true,
            name: true,
            images: true,
            promotionalPrice: true,
            retailPrice: true,
            features: true,
            model: true,
            type: true,
            brand: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
            primaryCategory: { select: { id: true, name: true } },
            secondaryCategory: { select: { id: true, name: true } },
            tertiaryCategory: { select: { id: true, name: true } },
            quaternaryCategory: { select: { id: true, name: true } },
            productTemplate: {
              select: {
                fields: {
                  select: {
                    fieldValue: true,
                    templateField: {
                      select: {
                        fieldName: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      take: 8,
    });

    // Post-processing to rank results by match relevance
    const rankedProducts = productsQuery
      .map((item) => {
        // Calculate a score based on matches
        let score = 0;
        const itemTextToSearch = [
          item.product.name,
          item.product.brand?.name || "",
          item.product.model || "",
          item.product.type || "",
          item.product.primaryCategory?.name || "",
          item.product.secondaryCategory?.name || "",
          item.product.tertiaryCategory?.name || "",
          item.product.quaternaryCategory?.name || "",
          ...(item.product.features || []),
        ]
          .join(" ")
          .toLowerCase();

        // Calculate how many terms match
        searchTerms.forEach((term) => {
          if (itemTextToSearch.includes(term)) score++;
        });

        // Extra points for brand + product name match
        if (
          item.product.brand?.name &&
          searchTerms.some((term) =>
            item.product.brand?.name?.toLowerCase().includes(term)
          ) &&
          searchTerms.some((term) =>
            item.product.name.toLowerCase().includes(term)
          )
        ) {
          score += 10; // Significant bonus for brand + product matches
        }

        // Exact product name match bonus
        if (item.product.name.toLowerCase() === validTerm.toLowerCase()) {
          score += 15; // Highest priority for exact matches
        }

        return {
          ...item,
          _score: score,
        };
      })
      .sort((a, b) => b._score - a._score); // Sort by score descending

    return NextResponse.json({
      brands,
      categories,
      products: rankedProducts.map(({ _score, ...item }) => item), // Remove the score before returning
    });
  } catch (error) {
    console.error("Error in search suggestions API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

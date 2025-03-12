import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Prisma } from "@prisma/client";

// Enable debugging
const DEBUG = true;

function debugLog(message: string, data?: any) {
  if (DEBUG) {
    console.log(`[DEBUG] ${message}`, data || "");
  }
}

const searchSchema = z.object({
  term: z.string().trim().min(1).max(100).nullable(),
});

// Type for inventory items with product details
type InventoryWithProduct = Prisma.InventoryGetPayload<{
  select: {
    id: true;
    stockCount: true;
    heldCount: true;
    deliveryEligibility: true;
    collectionEligibility: true;
    product: {
      select: {
        id: true;
        name: true;
        brandId: true;
        images: true;
        promotionalPrice: true;
        retailPrice: true;
        features: true;
        model: true;
        type: true;
        brand: {
          select: {
            id: true;
            name: true;
            image: true;
          };
        };
        primaryCategory: {
          select: {
            id: true;
            name: true;
          };
        };
        secondaryCategory: {
          select: {
            id: true;
            name: true;
          };
        };
        tertiaryCategory: {
          select: {
            id: true;
            name: true;
          };
        };
        quaternaryCategory: {
          select: {
            id: true;
            name: true;
          };
        };
      };
    };
  };
}>;

// Extended type with priority and score
type PrioritizedInventory = InventoryWithProduct & {
  _priority: number;
  _score?: number;
};

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const term = searchParams.get("term");

    debugLog("Search request received with term", term);

    const validatedParams = searchSchema.safeParse({ term });

    if (!validatedParams.success) {
      debugLog("Validation failed", validatedParams.error);
      return NextResponse.json(
        { error: "Invalid search term" },
        { status: 400 }
      );
    }

    const { term: validTerm } = validatedParams.data;

    // If no search term, return empty results
    if (!validTerm) {
      debugLog("Empty search term, returning empty results");
      return NextResponse.json({
        brands: [],
        categories: [],
        products: [],
      });
    }

    // Split search terms to handle multi-word searches
    const searchTerms = validTerm.toLowerCase().split(/\s+/).filter(Boolean);
    debugLog("Search terms after splitting", searchTerms);

    // STEP 1: Find matching brands
    debugLog("Finding matching brands first");
    const matchingBrands = await prisma.brand.findMany({
      where: {
        OR: [
          // Exact match (whole term)
          { name: { equals: validTerm, mode: Prisma.QueryMode.insensitive } },
          // Contains the whole search term
          { name: { contains: validTerm, mode: Prisma.QueryMode.insensitive } },
          // Match individual words
          ...searchTerms.map((term) => ({
            name: { contains: term, mode: Prisma.QueryMode.insensitive },
          })),
        ],
      },
      select: {
        id: true,
        name: true,
      },
    });

    debugLog(
      "Found matching brands",
      matchingBrands.map((b) => ({ id: b.id, name: b.name }))
    );

    // STEP 2: For each brand, calculate how well it matches
    const exactBrandMatch = matchingBrands.find(
      (b) => b.name.toLowerCase() === validTerm.toLowerCase()
    );

    const containsFullTermBrands = matchingBrands.filter((b) =>
      b.name.toLowerCase().includes(validTerm.toLowerCase())
    );

    // Get IDs of brands that should be prioritized
    const exactMatchBrandIds = exactBrandMatch ? [exactBrandMatch.id] : [];
    const fullTermMatchBrandIds = containsFullTermBrands.map((b) => b.id);
    const anyTermMatchBrandIds = matchingBrands.map((b) => b.id);

    debugLog("Brand match categories", {
      exactMatchCount: exactMatchBrandIds.length,
      fullTermMatchCount: fullTermMatchBrandIds.length,
      anyTermMatchCount: anyTermMatchBrandIds.length,
    });

    // Search brands for the response (limited to top 3)
    debugLog("Searching brands for response");
    const brands = await prisma.brand.findMany({
      where: {
        OR: [
          // Exact match prioritized
          { name: { equals: validTerm, mode: Prisma.QueryMode.insensitive } },
          // Match the whole search term in name
          { name: { contains: validTerm, mode: Prisma.QueryMode.insensitive } },
          // Match each word separately in name
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
    debugLog(
      "Found brands for response",
      brands.map((b) => b.name)
    );

    // Search categories
    debugLog("Searching categories");
    const categories = await prisma.category.findMany({
      where: {
        OR: [
          { name: { equals: validTerm, mode: Prisma.QueryMode.insensitive } },
          { name: { contains: validTerm, mode: Prisma.QueryMode.insensitive } },
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
    debugLog(
      "Found categories",
      categories.map((c) => c.name)
    );

    // STEP 3: Get products directly from exact brand matches first
    let exactBrandProducts: InventoryWithProduct[] = [];

    if (exactMatchBrandIds.length > 0 || fullTermMatchBrandIds.length > 0) {
      debugLog("Searching for products from exact/full term matching brands");

      const priorityBrandIds =
        exactMatchBrandIds.length > 0
          ? exactMatchBrandIds
          : fullTermMatchBrandIds;

      exactBrandProducts = await prisma.inventory.findMany({
        where: {
          product: {
            brandId: {
              in: priorityBrandIds,
            },
          },
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
              brandId: true,
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
            },
          },
        },
        take: 30,
      });

      debugLog(
        `Found ${exactBrandProducts.length} products from priority brands`,
        exactBrandProducts.slice(0, 5).map((p) => ({
          name: p.product.name,
          brand: p.product.brand?.name,
        }))
      );
    }

    // STEP 4: Run general search query for any other matching products
    debugLog("Running general product search");
    const generalProducts = await prisma.inventory.findMany({
      where: {
        OR: [
          // Match any term in product name
          {
            product: {
              OR: searchTerms.map((term) => ({
                name: { contains: term, mode: Prisma.QueryMode.insensitive },
              })),
            },
          },
          // Match any term in product model
          {
            product: {
              OR: searchTerms.map((term) => ({
                model: { contains: term, mode: Prisma.QueryMode.insensitive },
              })),
            },
          },
          // Match any term in product type
          {
            product: {
              OR: searchTerms.map((term) => ({
                type: { contains: term, mode: Prisma.QueryMode.insensitive },
              })),
            },
          },
          // Match any term in product description
          {
            product: {
              OR: searchTerms.map((term) => ({
                description: {
                  contains: term,
                  mode: Prisma.QueryMode.insensitive,
                },
              })),
            },
          },
          // Match any term in product features
          {
            product: {
              features: { hasSome: searchTerms },
            },
          },
          // Match entire term in categories
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
            brandId: true,
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
          },
        },
      },
      take: 30,
    });

    debugLog(`Found ${generalProducts.length} products from general search`);

    // STEP 5: Combine and deduplicate products
    // Create a Set to track unique product IDs
    const productIdSet = new Set<string>();
    const combinedProducts: PrioritizedInventory[] = [];

    // First add all brand-matched products (highest priority)
    exactBrandProducts.forEach((product) => {
      if (!productIdSet.has(product.id)) {
        productIdSet.add(product.id);
        combinedProducts.push({
          ...product,
          _priority: 1, // Highest priority
        });
      }
    });

    // Then add products from general search
    generalProducts.forEach((product) => {
      if (!productIdSet.has(product.id)) {
        productIdSet.add(product.id);

        // Check if this product's brand is in our matched brands
        const isBrandMatch =
          product.product.brandId &&
          anyTermMatchBrandIds.includes(product.product.brandId);

        combinedProducts.push({
          ...product,
          _priority: isBrandMatch ? 2 : 3, // Higher priority for brand matches
        });
      }
    });

    debugLog(`Combined ${combinedProducts.length} unique products`);

    // STEP 6: Apply ranking scores
    const rankedProducts = combinedProducts.map((item) => {
      const productName = item.product.name.toLowerCase();
      const brandName = item.product.brand?.name?.toLowerCase() || "";
      const brandId = item.product.brandId;

      // Start with a base score based on priority
      let score = 0;

      // Priority levels have the biggest impact on score
      switch (item._priority) {
        case 1: // Exact brand match
          score += 1000000;
          break;
        case 2: // Brand match from general search
          score += 100000;
          break;
        case 3: // Other product
          score += 10000;
          break;
      }

      // Additional scoring
      // Brand match type (if any)
      if (brandId) {
        if (exactMatchBrandIds.includes(brandId)) {
          score += 50000;
        } else if (fullTermMatchBrandIds.includes(brandId)) {
          score += 30000;
        } else if (anyTermMatchBrandIds.includes(brandId)) {
          score += 10000;
        }
      }

      // Product name matching
      const exactNameMatch = productName === validTerm.toLowerCase();
      const nameContainsTerm = productName.includes(validTerm.toLowerCase());
      const nameContainsAnyWord = searchTerms.some((term) =>
        productName.includes(term)
      );

      if (exactNameMatch) {
        score += 5000;
      } else if (nameContainsTerm) {
        score += 3000;
      } else if (nameContainsAnyWord) {
        score += 1000;
      }

      // Count term matches for fine-grained ranking
      let termMatches = 0;
      const itemTextToSearch = [
        productName,
        brandName,
        item.product.model?.toLowerCase() || "",
        item.product.type?.toLowerCase() || "",
        item.product.primaryCategory?.name?.toLowerCase() || "",
        item.product.secondaryCategory?.name?.toLowerCase() || "",
        item.product.tertiaryCategory?.name?.toLowerCase() || "",
        item.product.quaternaryCategory?.name?.toLowerCase() || "",
        ...(item.product.features?.map((f) => f.toLowerCase()) || []),
      ].join(" ");

      searchTerms.forEach((term) => {
        if (itemTextToSearch.includes(term)) {
          termMatches++;
        }
      });

      score += termMatches * 100;

      return {
        ...item,
        _score: score,
      };
    });

    // Sort by score descending
    rankedProducts.sort((a, b) => (b._score || 0) - (a._score || 0));

    // Show ranking results for debugging
    debugLog(
      "Final product ranking results",
      rankedProducts.slice(0, 5).map((p) => ({
        name: p.product.name,
        brand: p.product.brand?.name,
        score: p._score,
        priority: p._priority,
      }))
    );

    // Return the top 8 products without the score and priority fields
    const finalProducts = rankedProducts
      .slice(0, 8)
      .map(({ _score, _priority, ...item }) => item);

    debugLog("Final response prepared with", {
      brandsCount: brands.length,
      categoriesCount: categories.length,
      productsCount: finalProducts.length,
    });

    return NextResponse.json({
      brands,
      categories,
      products: finalProducts,
    });
  } catch (error) {
    console.error("Error in search suggestions API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

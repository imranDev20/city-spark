"use client";

import { type EdgeStoreRouter } from "../app/api/edgestore/[...edgestore]/route";
import { createEdgeStoreProvider } from "@edgestore/react";
import { type InferClientResponse } from "@edgestore/server/core";

export const { EdgeStoreProvider, useEdgeStore } =
  createEdgeStoreProvider<EdgeStoreRouter>({
    maxConcurrentUploads: 6,
  });

export type ClientResponse = InferClientResponse<EdgeStoreRouter>;

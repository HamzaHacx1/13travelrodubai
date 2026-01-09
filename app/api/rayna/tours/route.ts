import { NextRequest, NextResponse } from "next/server";

import { getRaynaConfig } from "@/lib/rayna";
import { buildRaynaImageProxyUrl } from "@/lib/raynaImages";

type RaynaTour = {
  tourId: number;
  tourName: string;
  imagePath?: string;
  rating?: number;
  reviewCount?: number;
  recommended?: boolean;
  cityName?: string;
  cityId?: number;
  countryId?: number;
  contractId?: number;
};

type RaynaTourResponse = {
  result?: RaynaTour[];
};

type RaynaTourPrice = {
  cityTourID: number;
  finalAdultAmount?: number;
  currency?: string;
  imagePath?: string;
  rating?: number;
  reviewCount?: number;
};

type RaynaPriceResponse = {
  result?: {
    tourPrice?: RaynaTourPrice[];
  };
};

type TourListing = {
  tourId: number;
  tourName: string;
  image?: string;
  rating?: number;
  reviewCount?: number;
  recommended?: boolean;
  cityName?: string;
  cityId?: number;
  countryId?: number;
  contractId?: number;
  priceFrom?: number;
  currency?: string;
};

type ToursRequest = {
  cityIds?: number[];
  countryId?: number;
  travelDate?: string;
  query?: string;
  limit?: number;
};

const buildTravelDate = () => {
  const travelDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
  return travelDate.toISOString().slice(0, 10);
};

const fetchRayna = async (endpoint: string, payload: Record<string, unknown>) => {
  const { baseUrl, token, headers, authScheme } = getRaynaConfig();
  const url = new URL(endpoint, baseUrl);
  const requestHeaders = new Headers({
    accept: "application/json",
    "content-type": "application/json",
  });

  if (headers) {
    Object.entries(headers).forEach(([key, value]) => {
      requestHeaders.set(key, value);
    });
  }

  if (token) {
    const authValue = authScheme ? `${authScheme} ${token}` : token;
    requestHeaders.set("authorization", authValue);
  }

  const response = await fetch(url, {
    method: "POST",
    headers: requestHeaders,
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Rayna request failed: ${response.status}`);
  }

  return response.json();
};

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const POST = async (request: NextRequest) => {
  try {
    const body = (await request.json()) as ToursRequest;
    const cityIds = Array.isArray(body?.cityIds)
      ? body.cityIds.filter(isFiniteNumber)
      : [];
    const countryId = body?.countryId;

    if (!isFiniteNumber(countryId) || cityIds.length === 0) {
      return NextResponse.json(
        { error: "cityIds and countryId are required." },
        { status: 400 },
      );
    }

    const travelDate = body.travelDate ?? buildTravelDate();
    const query = body.query?.trim().toLowerCase() ?? "";
    const limit = isFiniteNumber(body.limit) ? body.limit : undefined;

    const [staticResponses, priceResponses] = await Promise.all([
      Promise.all(
        cityIds.map((cityId) =>
          fetchRayna("/api/Tour/tourstaticdata", { cityId, countryId }),
        ),
      ),
      Promise.all(
        cityIds.map((cityId) =>
          fetchRayna("/api/Tour/gettourprice", {
            cityId,
            countryId,
            travelDate,
          }),
        ),
      ),
    ]);

    const priceMap = new Map<number, RaynaTourPrice>();
    priceResponses.forEach((priceResponse: RaynaPriceResponse) => {
      priceResponse.result?.tourPrice?.forEach((price) => {
        priceMap.set(price.cityTourID, price);
      });
    });

    const combinedTours = staticResponses.flatMap(
      (response: RaynaTourResponse) => response.result ?? [],
    );

    const uniqueTours = new Map<number, RaynaTour>();
    combinedTours.forEach((tour) => {
      if (!uniqueTours.has(tour.tourId)) {
        uniqueTours.set(tour.tourId, tour);
      }
    });

    const filteredTours = Array.from(uniqueTours.values()).filter((tour) => {
      if (!query) {
        return true;
      }
      return tour.tourName.toLowerCase().includes(query);
    });

    const limitedTours =
      typeof limit === "number" ? filteredTours.slice(0, limit) : filteredTours;

    const listings: TourListing[] = [];

    for (const tour of limitedTours) {
      const price = priceMap.get(tour.tourId);
      const priceValue = Number(price?.finalAdultAmount);
      const imageCandidates = [price?.imagePath, tour.imagePath].filter(
        Boolean,
      ) as string[];
      const proxyUrl = buildRaynaImageProxyUrl(imageCandidates);

      listings.push({
        tourId: tour.tourId,
        tourName: tour.tourName,
        image: proxyUrl,
        rating: tour.rating ?? price?.rating,
        reviewCount: tour.reviewCount ?? price?.reviewCount,
        recommended: tour.recommended,
        cityName: tour.cityName,
        cityId: tour.cityId,
        countryId: tour.countryId,
        contractId: tour.contractId,
        priceFrom: Number.isFinite(priceValue) ? priceValue : undefined,
        currency: price?.currency,
      });
    }

    return NextResponse.json({ tours: listings });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Rayna tours failed.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
};

import { useState, useEffect } from 'react';
import { getProductRatings } from '../apiServices/ProductServices/productItemServices';

type Review = {
    reviewID: number;
    userID: string;
    userName: string;
    orderDetailID: number;
    productItemID: number;
    shipperID?: string;
    shipperName?: string;
    date: string;
    productRating?: number;
    shipperRating?: number;
    productComment?: string;
    shipperComment?: string;
};

type ProductRating = {
    productItemID: number;
    productName: string;
    averageRating: number;
    totalReviewers: number;
    reviews: Review[] | { $values: Review[] };
};

export const useProductRatings = () => {
    const [ratings, setRatings] = useState<ProductRating[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRatings = async () => {
            setLoading(true);
            try {
                const data = await getProductRatings();

                // First check if we have a $values at the top level
                if (data && data.$values && Array.isArray(data.$values)) {
                    setRatings(data.$values);
                } else if (data && Array.isArray(data)) {
                    setRatings(data);
                } else if (data && typeof data === 'object') {
                    // Handle case where API might return an object with values
                    const ratingsArray = data.$values || data;
                    if (Array.isArray(ratingsArray)) {
                        setRatings(ratingsArray);
                    } else {
                        setRatings([]);
                    }
                } else {
                    setRatings([]);
                }
                setError(null);
            } catch {
                setError('Failed to fetch product ratings');
                setRatings([]);
            } finally {
                setLoading(false);
            }
        };

        fetchRatings();
    }, []);

    // Helper function to handle the nested $values structure
    const extractReviews = (reviewsData: Review[] | { $values: Review[] } | undefined): Review[] => {
        if (!reviewsData) return [];

        let reviews: Review[] = [];

        // Handle case where reviews is an object with $values
        if (typeof reviewsData === 'object' && '$values' in reviewsData && Array.isArray(reviewsData.$values)) {
            reviews = reviewsData.$values;
        }
        // Handle case where reviews is already an array
        else if (Array.isArray(reviewsData)) {
            reviews = reviewsData;
        }

        // Filter out reviews where productRating is null
        return reviews.filter(review => review.productRating !== null);
    };

    const getRatingForProduct = (productItemId: number) => {
        if (!Array.isArray(ratings)) {
            return { averageRating: 0, totalReviewers: 0, reviews: [] };
        }

        const productRating = ratings.find(r => r.productItemID === productItemId);

        let reviewsArray: Review[] = [];
        if (productRating) {
            reviewsArray = extractReviews(productRating.reviews);
        }

        return {
            averageRating: productRating?.averageRating || 0,
            totalReviewers: productRating?.totalReviewers || 0,
            reviews: reviewsArray
        };
    };

    return {
        ratings,
        loading,
        error,
        getRatingForProduct
    };
};
import { useState, useEffect } from 'react';
import { getProductRatings } from '../apiServices/ProductServices/productItemServices';

type ProductRating = {
    productItemID: number;
    productName: string;
    averageRating: number;
    totalReviewers: number;
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
                // Ensure data is an array before setting it to state
                if (data && Array.isArray(data)) {
                    setRatings(data);
                } else if (data && typeof data === 'object') {
                    // Handle case where API might return an object with values
                    const ratingsArray = data.$values || data;
                    if (Array.isArray(ratingsArray)) {
                        setRatings(ratingsArray);
                    } else {
                        console.error("API returned data in unexpected format:", data);
                        setRatings([]);
                    }
                } else {
                    setRatings([]);
                }
                setError(null);
            } catch (err) {
                console.error('Error fetching product ratings:', err);
                setError('Failed to fetch product ratings');
                setRatings([]);
            } finally {
                setLoading(false);
            }
        };

        fetchRatings();
    }, []);

    const getRatingForProduct = (productItemId: number) => {
        if (!Array.isArray(ratings)) {
            console.warn('Ratings is not an array:', ratings);
            return { averageRating: 0, totalReviewers: 0 };
        }

        const productRating = ratings.find(r => r.productItemID === productItemId);

        return {
            averageRating: productRating?.averageRating || 0,
            totalReviewers: productRating?.totalReviewers || 0
        };
    };

    return {
        ratings,
        loading,
        error,
        getRatingForProduct
    };
};
// useFetchData.js
import { useEffect, useState } from 'react';

const useFetchData = (asyncFunction) => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const result = await asyncFunction();
                setData(result);
                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        }

        fetchData();
    }, [asyncFunction]);

    return { data, error, loading };
};

export default useFetchData;
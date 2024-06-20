import React from 'react';
import { useQuery } from '@apollo/client';
import { Spinner, Card } from '@nextui-org/react';

interface TotalAmountRaisedProps {
    projectId: number;
}

const TotalAmountRaised: React.FC<TotalAmountRaisedProps> = ({ projectId }) => {

    //@ts-ignore
    const { loading, error, data } = useQuery(GET_TOTAL_AMOUNT_RAISED, {
        variables: { projectId },
    });

    if (loading) return <Spinner />;
    if (error) return <p className="text-red-500">Error: {error.message}</p>;

    const totalAmount = data?.totalAmountRaisedView?.nodes[0]?.totalAmount || 0;

    return (
        <></>
    );
};

export default TotalAmountRaised;

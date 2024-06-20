import React from 'react';
import { useQuery } from '@apollo/client';
import { Spinner, Card, Text } from '@nextui-org/react';

interface TotalAmountRaisedProps {
    projectId: number;
}

const TotalAmountRaised: React.FC<TotalAmountRaisedProps> = ({ projectId }) => {
    const { loading, error, data } = useQuery(GET_TOTAL_AMOUNT_RAISED, {
        variables: { projectId },
    });

    if (loading) return <Spinner />;
    if (error) return <p className="text-red-500">Error: {error.message}</p>;

    const totalAmount = data?.totalAmountRaisedView?.nodes[0]?.totalAmount || 0;

    return (
        <Card className="max-w-lg mx-auto my-8 p-6 bg-white rounded-lg shadow-md">
            <Card.Header>
                <Text h2>Total Amount Raised</Text>
            </Card.Header>
            <Card.Body>
                <Text className="text-2xl">{totalAmount} ETH</Text>
            </Card.Body>
        </Card>
    );
};

export default TotalAmountRaised;

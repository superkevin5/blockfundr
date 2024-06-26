// pages/_error.tsx
import React from 'react';
import { NextPageContext } from 'next';

interface ErrorProps {
    statusCode?: number;
}

const ErrorPage = ({ statusCode }: ErrorProps) => {
    return (
        <p>
            {statusCode
                ? `An error ${statusCode} occurred on server`
                : 'An error occurred on client'}
        </p>
    );
};

ErrorPage.getInitialProps = ({ res, err }: NextPageContext) => {
    const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
    return { statusCode };
};

export default ErrorPage;

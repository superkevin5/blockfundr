import DefaultLayout from '@/layouts/default';
import React, { useState } from 'react';
import FundraiserComponent from "@/components/fundraiserComponent";

export default function RaiserPage() {
    return (
        <DefaultLayout>
            <FundraiserComponent></FundraiserComponent>
        </DefaultLayout>
    );
}

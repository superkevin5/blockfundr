// pages/raiser.tsx

import { useQuery, useMutation, gql } from '@apollo/client';
import DefaultLayout from '@/layouts/default';
import React, {useEffect, useState} from 'react';
import { useDropzone } from 'react-dropzone';
import { Button, Input, Textarea } from '@nextui-org/react';
import {useSelector} from "react-redux";
import {useRouter} from "next/router";
import {GET_PROJECT_DETAILS} from "@/requests/queries";


export default function FundraiserComponent() {
    const router = useRouter();
    //@ts-ignore
    const user = useSelector(state => state.web3.user)

    const { loading, error, data } = useQuery(GET_PROJECT_DETAILS, {
        variables: { fundRaiserId: user?.userId },
        skip: !user,
    });
    // const [uploadVideo] = useMutation(UPLOAD_VIDEO);
    const [amount, setAmount] = useState<number>(0);
    // const [selectedVideo, setSelectedVideo] = useState<File | null>(null);

    // const onDrop = (acceptedFiles: File[]) => {
    //     setSelectedVideo(acceptedFiles[0]);
    // };

    // const { getRootProps, getInputProps } = useDropzone({
    //     onDrop,
    //     //@ts-ignore
    //     accept: 'video/*',
    // });

    // const handleUpload = async () => {
    //     if (selectedVideo) {
    //         try {
    //             // await uploadVideo({ variables: { projectId, video: selectedVideo } });
    //             alert('Video uploaded successfully');
    //         } catch (err) {
    //             console.error('Error uploading video:', err);
    //             alert('Error uploading video');
    //         }
    //     }
    // };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error loading project details</div>;

    const project = data?.allProjects;
    console.log('project', project)

    const handleContribution = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Submit contribution logic here
            alert('Contribution submitted successfully');
        } catch (err) {
            console.error('Error submitting contribution:', err);
            alert('Error submitting contribution');
        }
    };

    return (
            <div className="container mx-auto p-6">

            </div>
    );
}

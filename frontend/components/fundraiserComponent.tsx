import React, {useState, ChangeEvent, FormEvent, useEffect} from 'react';
import {toast} from 'react-toastify';
import {useMutation, useQuery} from "@apollo/client";
import {ADD_PROJECT_MUTATION} from "@/requests/mutations";
import {useSelector} from "react-redux";
import {GET_PROJECT_BY_FUNDRAISER_ID} from "@/requests/queries";
import _ from 'lodash'
import {formatTimestampToLocalDateTime} from "@/utils/date";
import {getCrowdFundingContract} from "@/utils/requestHandlers";
import {etherToWei} from "@/utils/common";
import {getMyProject} from "@/requests/chainRequests";

const notify = (error: string) => toast.error(error); // Function to display error notifications
const notifySuccess = (msg: string) => toast.success(msg); // Function to display error notifications

const FundRaiserComponent: React.FC = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        goal: '',
        deadline: '',
    });
    const [uploadProgress, setUploadProgress] = useState(0);
    const [videoUrl, setVideoUrl] = useState<string>(''); // New state for the video URL
    const [addProject] = useMutation(ADD_PROJECT_MUTATION);
    const [isProjectExists, setIsProjectExists] = useState(false);
    //@ts-ignore
    const account = useSelector((state) => state.web3.account);
    useEffect(() => {
        loadMyProject();
    }, [account]); // Run this effect when the account changes


    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value, type, checked, files} = e.target as HTMLInputElement;
        if (type === 'file' && files && files.length > 0) {
            const file = files[0];
            if (file.size > 50 * 1024 * 1024) {
                notify('File size exceeds 50MB limit. Please choose a smaller file.');
                setVideoUrl('');
            } else {
                setVideoUrl('');
                handleFileUpload(file);
            }
        } else {
            setFormData({
                ...formData,
                [name]: type === 'checkbox' ? checked : value
            });
        }
    };

    async function loadMyProject() {
        try {
            const projects = await getMyProject(account);
            if (!_.isEmpty(projects)) {
                const myProject = projects[0];
                setFormData({
                    title: myProject.title,
                    description: myProject.description,
                    goal: myProject.goalAmount,
                    deadline: myProject.deadline,
                });
                setIsProjectExists(true);
            }
        } catch (error) {
            console.error('Failed to load project:', error);
            notify('Failed to load project details.');
        }
    }
    const handleFileUpload = (file: File) => {
        const uploadFormData = new FormData();
        uploadFormData.append('video', file);

        const xhr = new XMLHttpRequest();
        xhr.open('POST', process.env.apiRoot + '/api/upload-video', true); // Replace with your upload endpoint
        xhr.withCredentials = true; // Include cookies with the request

        xhr.upload.onprogress = (e: ProgressEvent) => {
            if (e.lengthComputable) {
                const progress = Math.round((e.loaded / e.total) * 100);
                setUploadProgress(progress);
            }
        };

        xhr.onload = () => {
            if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                setVideoUrl(response.videoUrl); // Store the video URL
                setUploadProgress(0); // Reset progress after upload
            } else {
                console.error('Upload failed');
            }
        };

        xhr.onerror = () => {
            console.error('Upload error');
        };

        xhr.send(uploadFormData);
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const {title, description, goal, deadline} = formData;
            const crowdFundingContract = await getCrowdFundingContract()
            //@ts-ignore
            const res = await crowdFundingContract.methods.createProject(etherToWei(0.00001), new Date(deadline).getTime(), etherToWei(Number(goal)), title, description).send({from: account})
            // Optionally, reset form fields here
            await loadMyProject()
            notifySuccess('Project Created')
        } catch (error) {
            console.error('Failed to add project:', error);
            notify('Failed to add project. Please try again.');
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md flex">
            {/* Video Upload Zone */}
            <div className="w-1/2 pr-6">
                {!isProjectExists && <> <h2 className="text-2xl font-bold mb-4">Upload Video</h2>
                    <div className="flex items-center justify-center w-full">
                        <label htmlFor="video-upload"
                               className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-500 focus:outline-none">
                            <svg className="w-12 h-12 text-gray-400" fill="currentColor"
                                 xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <path
                                    d="M16.8 4.29A7.95 7.95 0 0010 2a7.95 7.95 0 00-6.8 2.29 7.95 7.95 0 000 11.42A7.95 7.95 0 0010 18a7.95 7.95 0 006.8-2.29 7.95 7.95 0 000-11.42zM10 16c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm-1-9v4.59l3.29 3.29 1.42-1.42L11 10.17V7H9zm1-5a9 9 0 100 18 9 9 0 000-18z"/>
                            </svg>
                            <span className="mt-2 text-sm text-gray-600">Click to upload a video (Max size: 50MB)</span>
                            <input id="video-upload" name="video_url" type="file" className="hidden"
                                   onChange={handleChange}/>
                        </label>
                    </div>
                    {uploadProgress > 0 && (
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
                            <div className="bg-blue-600 h-2.5 rounded-full" style={{width: `${uploadProgress}%`}}></div>
                        </div>
                    )}
                </>}
                {videoUrl && (
                    <div className="mt-4">
                        <h3 className="text-lg font-semibold mb-2">Uploaded Video:</h3>
                        <video controls className="w-full">
                            <source src={process.env.apiRoot + '/api' + videoUrl} type="video/mp4"/>
                            Your browser does not support the video tag.
                        </video>
                    </div>
                )}
            </div>
            {/* Form Fields */}
            <div className="w-1/2 pl-6">
                {!isProjectExists && <h2 className="text-2xl font-bold mb-4">Create a New Project</h2>}
                {isProjectExists && <h2 className="text-2xl font-bold mb-4">Your Project</h2>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700">Title:</label>
                        <input
                            disabled={isProjectExists}
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Description:</label>
                        <textarea
                            disabled={isProjectExists}
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                        ></textarea>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Goal (Number of ETH):</label>
                        <input
                            disabled={isProjectExists}
                            placeholder="Input number of ETH to Raise"
                            type="number"
                            name="goal"
                            value={formData.goal}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Deadline:</label>
                        {!isProjectExists && <input
                            disabled={isProjectExists}
                            type="datetime-local"
                            name="deadline"
                            value={formData.deadline}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                        />
                        }
                        {isProjectExists && formData.deadline}
                    </div>
                    {!isProjectExists && <button
                        type="submit"
                        className="w-full bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
                    >
                        Submit
                    </button>}
                </form>
            </div>
            <div>


            </div>
        </div>
    );
};

export default FundRaiserComponent;

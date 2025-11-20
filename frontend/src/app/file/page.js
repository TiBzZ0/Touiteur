'use client';

import { useSearchParams } from 'next/navigation';
import { getFile, getFileByUuid } from '@/utils/fileApi'; // Adjust the import path as necessary
import { useEffect, useState } from 'react';

export default function FilePage() {
    const searchParams = useSearchParams();
    const uuid = searchParams.get('uuid');
    const fileUrl = process.env.NODE_ENV === 'production' 
        ? 'https://dev.touiteur.be'
        : 'http://localhost:8080';

    const [filePath, setFilePath] = useState(null);

    useEffect(() => {
        if (!uuid) {
            console.error('Invalid file parameters. Please provide UUID');
            return;
        }

        getFileByUuid(uuid)
            .then((response) => {
                if (response) {
                    setFilePath(response.url);
                } else {
                    console.error('File not found or unsupported format.');
                }
            })
            .catch((error) => {
                console.error('Error fetching file:', error);
            });
    }, [uuid]);

    if (!uuid) {
        return <p>Invalid file parameters. Please provide UUID</p>;
    }

    return (
        filePath ? (
            <iframe
                src={`${fileUrl}${filePath}`}
                style={{ width: '100%', height: '100vh', border: 'none' }}
                title="File Viewer"
            />
        ) : (
            <p>File not found or unsupported format.</p>
        )
    );
}
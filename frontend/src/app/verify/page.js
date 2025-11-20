'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { verifyUser } from '@/utils/authApi.js'; // Adjust the import path as needed

export default function VerifyPage() {
    const router = useRouter();

    useEffect(() => {
        async function fetchVerification() {
            try {
                const params = new URLSearchParams(window.location.search);
                const token = params.get('token');

                if (!token) {
                    throw new Error('Missing token in URL');
                }
                // Call the API to verify the account
                const response = await verifyUser(token);
                if (!response || !response.success) {
                    router.push('/auth?verified=false');
                }
                router.push('/auth?verified=true'); // Redirect to login after verification
            } catch (error) {
                console.error('Verification failed:', error);
                router.push('/auth?verified=false'); // Redirect to login with failure message
            }};
        fetchVerification();
    }, [router]);

    return (
        <div>
            <p>Verifying your account, please wait...</p>
        </div>
    );
}

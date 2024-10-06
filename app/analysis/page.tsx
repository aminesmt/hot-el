'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MapPin, Star, DollarSign, ExternalLink, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const DynamicMap = dynamic(() => import('@/components/Map'), { 
  ssr: false,
  loading: () => <Skeleton className="h-[600px] w-full rounded-md" />
});

const API_URL = 'https://polskanow.pl/analyze_hotels';

export default function AnalysisPage() {
  const [hotels, setHotels] = useState([]);
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urls = urlParams.get('urls')?.split(',') || [];

    if (urls.length === 0) {
      setError('No hotel URLs provided');
      setLoading(false);
      return;
    }

    fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ urls: urls }),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      if (!data.hotel_details || data.hotel_details.length === 0) {
        throw new Error('No hotel details found in the response');
      }
      setHotels(data.hotel_details);
      setAnalysis(data.analysis);
      setLoading(false);
    })
    .catch(error => {
      setError(`An error occurred while fetching hotel data: ${error.message}`);
      setLoading(false);
    });
  }, []);

  // ... rest of the component remains the same
}
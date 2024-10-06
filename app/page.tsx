'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export default function Home() {
  const [urls, setUrls] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const urlList = urls.split('\n').filter((url) => url.trim() !== '');
    router.push(
      `https://44b54a26-29c9-4002-b75c-cfbb36fb4314-00-ir6lotgx3llc.janeway.replit.dev/analysis?urls=${encodeURIComponent(
        urlList.join(',')
      )}`
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Hotel Analysis Tool
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="urls" className="block text-sm font-medium mb-2">
            Enter Hotel URLs (one per line):
          </label>
          <Textarea
            id="urls"
            value={urls}
            onChange={(e) => setUrls(e.target.value)}
            placeholder="https://www.booking.com/hotel/..."
            className="w-full h-40"
            required
          />
        </div>
        <div className="text-center">
          <Button type="submit">Analyze Hotels</Button>
        </div>
      </form>
    </div>
  );
}

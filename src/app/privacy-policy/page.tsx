import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 pb-32 prose prose-invert prose-emerald animate-in fade-in">
      <h1 className="text-4xl font-black tracking-tight mb-8">Privacy Policy</h1>
      <p className="text-zinc-500 mb-8 font-medium tracking-wide">Last updated: {new Date().toLocaleDateString()}</p>
      
      <h2 className="text-2xl font-bold mt-10 mb-4 border-b border-zinc-800 pb-2">1. Introduction</h2>
      <p className="text-zinc-300 leading-relaxed max-w-3xl">
        Welcome to BeatFlow. This Privacy Policy governs our application behavior and explicitly dictates how user data is respected. BeatFlow is an independent music explorer application heavily relying on the legal, royalty-free Jamendo API.
      </p>

      <h2 className="text-2xl font-bold mt-10 mb-4 border-b border-zinc-800 pb-2">2. Third-Party API Integration (Jamendo)</h2>
      <p className="text-zinc-300 leading-relaxed max-w-3xl">
        BeatFlow does not host, distribute, or legally possess any of the audio content streamed on the platform. All musical tracks are fetched dynamically from the <strong>Jamendo API</strong> under the Creative Commons license. Any interaction with music content is subject to Jamendo's own API structural guidelines.
      </p>

      <h2 className="text-2xl font-bold mt-10 mb-4 border-b border-zinc-800 pb-2">3. User Data</h2>
      <p className="text-zinc-300 leading-relaxed max-w-3xl">
        We use authentication protocols (Clerk) strictly to manage your internal saved states (such as favorite tracks and playlists). Your personal tracking information is kept fundamentally confidential and is not sold to third-party ad networks.
      </p>

      <h2 className="text-2xl font-bold mt-10 mb-4 border-b border-zinc-800 pb-2">4. Audio Downloads</h2>
      <p className="text-zinc-300 leading-relaxed max-w-3xl">
        The application explicitly only permits downloading tracks where the original independent author has opted into the Jamendo `audiodownload` allowance. BeatFlow acts purely as a routing conduit to these legal assets and claims absolutely no ownership over the copyright.
      </p>
    </div>
  );
}

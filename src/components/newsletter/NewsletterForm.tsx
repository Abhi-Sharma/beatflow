'use client';

import { useState } from 'react';
import { subscribe } from '@/app/actions/subscribe';

export function NewsletterForm() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  async function clientAction(formData: FormData) {
    setLoading(true);
    setMessage(null);
    
    const result = await subscribe(formData);
    
    if (result.success) {
      setMessage({ type: 'success', text: result.message! });
      const form = document.getElementById('newsletter-form') as HTMLFormElement;
      if (form) form.reset();
    } else {
      setMessage({ type: 'error', text: result.error! });
    }
    
    setLoading(false);
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <form id="newsletter-form" className="flex flex-col sm:flex-row gap-3" action={clientAction}>
        <input 
          type="email" 
          name="email"
          placeholder="Enter your email" 
          className="flex-1 bg-zinc-950 border border-zinc-700/50 rounded-full px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all disabled:opacity-50"
          required
          disabled={loading}
        />
        <button 
          type="submit" 
          disabled={loading}
          className="bg-emerald-500 text-black font-bold px-8 py-4 rounded-full hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20 active:scale-95 disabled:opacity-50 flex items-center justify-center min-w-[140px]"
        >
          {loading ? 'Wait...' : 'Subscribe'}
        </button>
      </form>
      {message && (
        <p className={`mt-4 text-sm font-medium ${message.type === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>
          {message.text}
        </p>
      )}
    </div>
  );
}

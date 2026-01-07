
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

import React from 'react';


const siteConfig = {
  name: 'LexAI',
  description: 'AI-powered chat and analysis platform for seamless interaction and information processing',
  keywords: ['AI', 'chat', 'analysis', 'machine learning', 'artificial intelligence'],
  authors: [{ name: ' Team' }],
  creator: '',
  themeColor: '#22D3EE',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png'
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://your-domain.com',
    title: 'AI Chat Platform',
    description: 'AI-powered chat and analysis platform for seamless interaction and information processing',
    siteName: 'NoBrainer'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Chat Platform',
    description: 'AI-powered chat and analysis platform for seamless interaction and information processing',
    creator: '@yourhandle'
  }
};





export default function RootLayout({ children }) {
  

  return (
    <ClerkProvider>
      <html lang="en">
        <head>
        <title>{siteConfig.name}</title>
        
     

       

        </head>

        <body>
         
          
      
              
                <div>
                  {children}
                </div>
          
        
        
          
        </body>
      </html>
    </ClerkProvider>
  );
}
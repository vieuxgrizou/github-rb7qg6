import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Sparkles, Zap, Users, Bot, Shield, Globe2 } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';

const FEATURES = [
  {
    icon: Sparkles,
    title: 'Advanced AI',
    description: 'Leverage top AI models (GPT-4, Claude, Gemini) for natural and engaging comments'
  },
  {
    icon: Users,
    title: 'Smart Personas',
    description: 'Create and manage realistic profiles with customized writing styles, tones, and languages'
  },
  {
    icon: Zap,
    title: 'Automation',
    description: 'Schedule your interactions with advanced rules and intelligent timing management'
  },
  {
    icon: Globe2,
    title: 'Multi-Site Support',
    description: 'Manage multiple WordPress sites with distinct configurations and personas'
  },
  {
    icon: Shield,
    title: 'Security & GDPR',
    description: 'Built-in data protection, two-factor authentication, and GDPR compliance'
  },
  {
    icon: Bot,
    title: 'Smart Engagement',
    description: 'Automatically respond to user comments and maintain natural conversation flows'
  }
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark">
      <header className="bg-white dark:bg-dark-paper border-b border-gray-200 dark:border-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Brain className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-xl font-bold text-gray-900 dark:text-dark-primary">Intensify</span>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <button
                onClick={() => navigate('/auth')}
                className="button-secondary"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/auth?signup=true')}
                className="button-primary"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="text-center">
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 dark:text-dark-primary sm:text-5xl md:text-6xl">
                <span className="block">Automate your interactions</span>
                <span className="block text-primary-600">with a human touch</span>
              </h1>
              <p className="mt-3 max-w-md mx-auto text-base text-gray-600 dark:text-dark-secondary sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                Generate authentic and engaging WordPress comments using AI
              </p>
              <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
                <div className="rounded-md shadow">
                  <button
                    onClick={() => navigate('/auth?signup=true')}
                    className="button-primary w-full md:w-auto"
                  >
                    Get started now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="bg-white dark:bg-dark-paper py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-gray-900 dark:text-dark-primary sm:text-4xl">
                Everything you need to boost engagement
              </h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-dark-secondary">
                Comprehensive tools for managing and automating WordPress comments
              </p>
            </div>

            <div className="mt-20">
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {FEATURES.map((feature) => (
                  <div key={feature.title} className="pt-6">
                    <div className="flow-root bg-gray-50 dark:bg-dark rounded-lg px-6 pb-8">
                      <div className="-mt-6">
                        <div>
                          <span className="inline-flex items-center justify-center p-3 bg-primary-500 rounded-md shadow-lg">
                            <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                          </span>
                        </div>
                        <h3 className="mt-8 text-lg font-medium text-gray-900 dark:text-dark-primary tracking-tight">
                          {feature.title}
                        </h3>
                        <p className="mt-5 text-base text-gray-600 dark:text-dark-secondary">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-primary-700">
          <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              <span className="block">Ready to get started?</span>
              <span className="block">Start your free trial today.</span>
            </h2>
            <p className="mt-4 text-lg leading-6 text-primary-200">
              No credit card required. Start engaging with your audience in minutes.
            </p>
            <button
              onClick={() => navigate('/auth?signup=true')}
              className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-primary-50 sm:w-auto"
            >
              Sign up for free
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-dark-paper">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Brain className="h-6 w-6 text-primary-600" />
              <span className="ml-2 text-lg font-semibold text-gray-900 dark:text-dark-primary">
                Intensify
              </span>
            </div>
            <p className="text-base text-gray-500 dark:text-dark-secondary">
              © {new Date().getFullYear()} Intensify. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
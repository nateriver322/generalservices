import React, { memo } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Tool, Clock, Bell } from 'lucide-react';
import TicketAppBar from './TicketAppBar';

const StepCard = memo(({ icon: Icon, title, description }) => (
  <Card className="p-6 hover:shadow-lg transition-shadow">
    <div className="flex items-start space-x-4">
      <div className="p-3 bg-blue-100 rounded-lg">
        <Icon className="w-6 h-6 text-blue-600" />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  </Card>
));

StepCard.displayName = 'StepCard';

const Welcome = memo(({ username }) => (
  <div className="text-center mb-12">
    <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
      Welcome back, {username}!
    </h1>
    <p className="text-gray-600 text-lg">
      Here's how you can submit a repair or installation request
    </p>
  </div>
));

Welcome.displayName = 'Welcome';

const QuickActions = memo(() => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
    <Button
      variant="default"
      className="p-6 h-auto flex items-center justify-between group"
    >
      <span className="flex items-center">
        <Tool className="w-5 h-5 mr-2" />
        Submit New Ticket
      </span>
      <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
    </Button>
    <Button
      variant="outline"
      className="p-6 h-auto flex items-center justify-between group"
    >
      <span className="flex items-center">
        <Clock className="w-5 h-5 mr-2" />
        View Existing Tickets
      </span>
      <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
    </Button>
  </div>
));

QuickActions.displayName = 'QuickActions';

const Dashboard = () => {
  const username = sessionStorage.getItem('username');

  if (!username) {
    return <Navigate to="/" replace />;
  }

  const steps = [
    {
      icon: Tool,
      title: "1. Select Service Type",
      description: "Choose between repair request or new installation service."
    },
    {
      icon: Bell,
      title: "2. Provide Details",
      description: "Describe the issue and upload relevant photos if needed."
    },
    {
      icon: Clock,
      title: "3. Submit and Track",
      description: "Track your request status in real-time through the dashboard."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <TicketAppBar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Welcome username={username} />
        
        <QuickActions />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <StepCard {...step} />
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default memo(Dashboard);
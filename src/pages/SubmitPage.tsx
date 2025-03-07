
import React from 'react';
import MessageForm from '@/components/message/MessageForm';
import PageTransition from '@/components/layout/PageTransition';

const SubmitPage: React.FC = () => {
  return (
    <PageTransition>
      <div className="container mx-auto max-w-2xl py-12 px-4">
        <MessageForm />
      </div>
    </PageTransition>
  );
};

export default SubmitPage;

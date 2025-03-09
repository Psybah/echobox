
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Lock, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import EchoLogo from '@/components/layout/EchoLogo';
import PageTransition from '@/components/layout/PageTransition';

const Index: React.FC = () => {
  return (
    <PageTransition>
      <div className="mx-auto px-4 py-12 md:py-24 max-w-6xl container">
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <EchoLogo size="lg" />
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-6 font-bold text-4xl md:text-6xl leading-tight tracking-tighter"
          >
            <span className="text-gradient">Anonymous Messaging</span>
            <br />
            <span>with End-to-End Security</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-10 max-w-2xl text-muted-foreground text-xl"
          >
            Share text, images, voice notes, and documents anonymously.
            Your identity remains completely private.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex sm:flex-row flex-col gap-4 mb-20"
          >
            <Button asChild size="lg" className="group">
              <Link to="/submit">
                Send a message
                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/admin-login">Admin Portal</Link>
            </Button>
          </motion.div>
          
          <div className="gap-8 grid grid-cols-1 md:grid-cols-3 mx-auto w-full max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="p-6 text-center glass-card"
            >
              <div className="flex justify-center mb-4">
                <div className="bg-echo-purple/10 p-3 rounded-full">
                  <MessageCircle className="w-6 h-6 text-echo-purple" />
                </div>
              </div>
              <h3 className="mb-2 font-semibold">Multi-Format Messages</h3>
              <p className="text-muted-foreground text-sm">
                Send text, images, voice notes, or document files with ease.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="p-6 text-center glass-card"
            >
              <div className="flex justify-center mb-4">
                <div className="bg-echo-blue/10 p-3 rounded-full">
                  <Lock className="w-6 h-6 text-echo-blue" />
                </div>
              </div>
              <h3 className="mb-2 font-semibold">Fully Anonymous</h3>
              <p className="text-muted-foreground text-sm">
                No registration or personal details required. Stay completely anonymous.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="p-6 text-center glass-card"
            >
              <div className="flex justify-center mb-4">
                <div className="bg-green-500/10 p-3 rounded-full">
                  <ShieldCheck className="w-6 h-6 text-green-500" />
                </div>
              </div>
              <h3 className="mb-2 font-semibold">Secure Transmission</h3>
              <p className="text-muted-foreground text-sm">
                End-to-end security keeps your communications private and protected.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Index;


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
      <div className="container mx-auto max-w-6xl px-4 py-12 md:py-24">
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
            className="text-4xl md:text-6xl font-bold leading-tight tracking-tighter mb-6"
          >
            <span className="text-gradient">Anonymous Messaging</span>
            <br />
            <span>with End-to-End Security</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-muted-foreground max-w-2xl mb-10"
          >
            Share text, images, voice notes, and documents anonymously.
            Your identity remains completely private.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 mb-20"
          >
            <Button asChild size="lg" className="group">
              <Link to="/submit">
                Send a message
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/admin">Admin Portal</Link>
            </Button>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="glass-card p-6 text-center"
            >
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-full bg-echo-purple/10">
                  <MessageCircle className="h-6 w-6 text-echo-purple" />
                </div>
              </div>
              <h3 className="font-semibold mb-2">Multi-Format Messages</h3>
              <p className="text-sm text-muted-foreground">
                Send text, images, voice notes, or document files with ease.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="glass-card p-6 text-center"
            >
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-full bg-echo-blue/10">
                  <Lock className="h-6 w-6 text-echo-blue" />
                </div>
              </div>
              <h3 className="font-semibold mb-2">Fully Anonymous</h3>
              <p className="text-sm text-muted-foreground">
                No registration or personal details required. Stay completely anonymous.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="glass-card p-6 text-center"
            >
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-full bg-green-500/10">
                  <ShieldCheck className="h-6 w-6 text-green-500" />
                </div>
              </div>
              <h3 className="font-semibold mb-2">Secure Transmission</h3>
              <p className="text-sm text-muted-foreground">
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

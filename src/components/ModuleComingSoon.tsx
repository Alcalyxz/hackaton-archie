import { motion } from 'motion/react';
import { Sparkles, Clock, Rocket } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

interface ModuleComingSoonProps {
  /**
   * Module name to display
   * @example "Analytics Dashboard"
   */
  moduleName?: string;
  
  /**
   * Optional description
   */
  description?: string;
  
  /**
   * Show animated skeleton preview
   * @default true
   */
  showSkeleton?: boolean;
}

/**
 * Modern "Coming Soon" component for modules under development
 * 
 * Features:
 * - Animated entrance with motion (motion/react)
 * - Skeleton loading preview
 * - Gradient accents
 * - Responsive design
 * - Glass morphism effect
 * 
 * @example
 * <ModuleComingSoon 
 *   moduleName="Analytics Dashboard" 
 *   description="Advanced metrics and insights"
 * />
 */
export function ModuleComingSoon({
  moduleName = 'Module',
  description,
  showSkeleton = true,
}: ModuleComingSoonProps) {
  return (
    <div data-vid="xj7lqit" className="min-h-[80vh] flex items-center justify-center p-4 md:p-8">
      <motion.div data-vid="jyeglcj"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl"
      >
        <Card data-vid="5xp6ryg" className="relative overflow-hidden border-2 border-dashed border-primary/20 bg-gradient-to-br from-background via-background to-primary/5 backdrop-blur-sm">
          {/* Animated gradient background */}
          <motion.div data-vid="sksq29d"
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%'],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
            className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 bg-[length:200%_200%]"
          />

          <div data-vid="pmfre6i" className="relative p-8 md:p-12 space-y-8">
            {/* Header */}
            <div data-vid="j9278j3" className="text-center space-y-4">
              <motion.div data-vid="d2f3sxx"
                animate={{
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="inline-block"
              >
                <div data-vid="1bq0tw5" className="relative">
                  <div data-vid="6d4kll9" className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
                  <div data-vid="8nl3f0a" className="relative bg-primary/10 p-6 rounded-full">
                    <Sparkles data-vid="aitzcmq" className="w-12 h-12 text-primary" />
                  </div>
                </div>
              </motion.div>

              <div data-vid="3yuu4i5" className="space-y-2">
                <Badge data-vid="fqr6cwl" variant="secondary" className="gap-1.5">
                  <Clock data-vid="44s9kwr" className="w-3 h-3" />
                  Under Development
                </Badge>
                
                <motion.h2 data-vid="nwxg4n4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent"
                >
                  {moduleName}
                </motion.h2>
                
                <motion.p data-vid="qbqelu3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-lg text-muted-foreground max-w-md mx-auto"
                >
                  This module is not yet available
                </motion.p>

                {description && (
                  <motion.p data-vid="gnrj3su"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-sm text-muted-foreground max-w-lg mx-auto pt-2"
                  >
                    {description}
                  </motion.p>
                )}
              </div>
            </div>

            {/* Skeleton Preview */}
            {showSkeleton && (
              <motion.div data-vid="eua17md"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-4"
              >
                <div data-vid="k75bdqi" className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <motion.div data-vid="jyoiyd5"
                      key={i}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                    >
                      <Card data-vid="m2nwddc" className="p-6 space-y-3 bg-card/50 backdrop-blur-sm">
                        <Skeleton data-vid="rbqixg7" className="h-12 w-12 rounded-lg" />
                        <Skeleton data-vid="35fy5bs" className="h-4 w-3/4" />
                        <Skeleton data-vid="7emwj2b" className="h-3 w-full" />
                        <Skeleton data-vid="6x5yg71" className="h-3 w-2/3" />
                      </Card>
                    </motion.div>
                  ))}
                </div>

                <Card data-vid="qhelza1" className="p-6 space-y-4 bg-card/50 backdrop-blur-sm">
                  <div data-vid="cdciyzm" className="flex items-center gap-4">
                    <Skeleton data-vid="ubofdof" className="h-16 w-16 rounded-full" />
                    <div data-vid="9vppc06" className="flex-1 space-y-2">
                      <Skeleton data-vid="hg8ifvq" className="h-4 w-1/4" />
                      <Skeleton data-vid="nuh3h8r" className="h-3 w-1/2" />
                    </div>
                  </div>
                  <div data-vid="42lm5ge" className="space-y-2">
                    <Skeleton data-vid="ey1d3vj" className="h-3 w-full" />
                    <Skeleton data-vid="ade7uqd" className="h-3 w-5/6" />
                    <Skeleton data-vid="45t7twm" className="h-3 w-4/6" />
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Footer Message */}
            <motion.div data-vid="mmbkxai"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-center pt-4"
            >
              <div data-vid="b8ztt63" className="inline-flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-4 py-2 rounded-full backdrop-blur-sm">
                <Rocket data-vid="qc8xrv4" className="w-4 h-4" />
                <span data-vid="fduyk30">We're working hard to bring this to you soon</span>
              </div>
            </motion.div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}


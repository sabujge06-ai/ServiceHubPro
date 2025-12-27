import { Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Zap,
  Shield,
  CreditCard,
  Users,
  Clock,
  CheckCircle2,
  ArrowRight,
  Star,
  Sparkles,
} from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Experience blazing fast service access with our optimized infrastructure.',
  },
  {
    icon: Shield,
    title: 'Secure & Verified',
    description: 'Multi-layer verification ensures your account and transactions are protected.',
  },
  {
    icon: CreditCard,
    title: 'Flexible Payments',
    description: 'Multiple payment channels with transparent pricing and instant top-ups.',
  },
  {
    icon: Users,
    title: 'User Friendly',
    description: 'Intuitive dashboard designed for seamless service management.',
  },
  {
    icon: Clock,
    title: 'Always Available',
    description: '24/7 service availability with real-time usage tracking.',
  },
  {
    icon: CheckCircle2,
    title: 'Subscription Plans',
    description: 'Choose from flexible plans that fit your needs and budget.',
  },
];

const plans = [
  { name: 'Brins', duration: 30, price: 299, popular: false },
  { name: 'Starter', duration: 7, price: 79, popular: false },
  { name: 'Basic', duration: 15, price: 149, popular: true },
  { name: 'Advanced', duration: 45, price: 399, popular: false },
  { name: 'Pro', duration: 60, price: 499, popular: false },
  { name: 'Ultimate', duration: 90, price: 699, popular: false },
];

export function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto relative">
          <div className="max-w-4xl mx-auto text-center animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-8">
              <Sparkles className="w-4 h-4" />
              Revolutionizing Service Management
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold mb-6 leading-tight">
              Manage Your Services{' '}
              <span className="gradient-text">Effortlessly</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              One platform to access services, manage subscriptions, and handle payments.
              Simple, secure, and designed for you.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register">
                <Button variant="gradient" size="xl" className="min-w-[200px]">
                  Get Started Free
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="xl" className="min-w-[200px]">
                  Sign In
                </Button>
              </Link>
            </div>

            <p className="text-sm text-muted-foreground mt-6">
              ✓ Gmail registration only ✓ Email verification required ✓ Service cost ৳5 per use
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Everything You Need
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed to streamline your service experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card
                key={feature.title}
                className="glass-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <CardTitle className="font-display">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Subscription Plans
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Choose a plan that works for you. All plans include unlimited service access.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={`relative overflow-hidden transition-all duration-300 hover:-translate-y-1 ${
                  plan.popular
                    ? 'border-primary shadow-lg shadow-primary/20'
                    : 'glass-card'
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0">
                    <div className="bg-gradient-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-bl-lg flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      Popular
                    </div>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="font-display">{plan.name}</CardTitle>
                  <CardDescription>{plan.duration} days access</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <span className="text-4xl font-display font-bold">৳{plan.price}</span>
                    <span className="text-muted-foreground">/plan</span>
                  </div>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                      Unlimited service access
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                      {plan.duration} days validity
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                      Priority support
                    </li>
                  </ul>
                  <Link to="/register">
                    <Button
                      variant={plan.popular ? 'gradient' : 'outline'}
                      className="w-full"
                    >
                      Get Started
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <Card className="bg-gradient-primary overflow-hidden relative">
            <div className="absolute inset-0 bg-black/10" />
            <CardContent className="relative py-16 text-center">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-primary-foreground mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
                Join thousands of users who trust ServiceHub for their service needs.
                Sign up now and get instant access.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/register">
                  <Button size="xl" className="bg-background text-foreground hover:bg-background/90 min-w-[200px]">
                    Create Free Account
                  </Button>
                </Link>
                <Link to="/admin/login">
                  <Button
                    size="xl"
                    variant="outline"
                    className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 min-w-[200px]"
                  >
                    Admin Login
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}

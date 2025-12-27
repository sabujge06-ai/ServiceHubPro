import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Shield, Zap, CreditCard, Users, Clock, Headphones, 
  Lock, BarChart3, Bell, Globe 
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const features = [
  {
    icon: Shield,
    title: "Secure Platform",
    description: "Enterprise-grade security with encrypted transactions and data protection.",
  },
  {
    icon: Zap,
    title: "Fast Services",
    description: "Lightning-fast service delivery with instant activation and processing.",
  },
  {
    icon: CreditCard,
    title: "Flexible Payments",
    description: "Multiple payment channels with manual approval for security.",
  },
  {
    icon: Users,
    title: "User Management",
    description: "Complete user verification system with email and phone validation.",
  },
  {
    icon: Clock,
    title: "24/7 Availability",
    description: "Access your services anytime, anywhere with our always-on platform.",
  },
  {
    icon: Headphones,
    title: "Dedicated Support",
    description: "Expert support team ready to help you with any questions.",
  },
  {
    icon: Lock,
    title: "Account Protection",
    description: "Advanced account security with OTP verification and admin oversight.",
  },
  {
    icon: BarChart3,
    title: "Usage Tracking",
    description: "Detailed analytics and usage history for all your services.",
  },
  {
    icon: Bell,
    title: "Notifications",
    description: "Real-time updates on payments, subscriptions, and account activity.",
  },
  {
    icon: Globe,
    title: "Wide Coverage",
    description: "Comprehensive service coverage across Bangladesh.",
  },
];

export const Features = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">Features</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Powerful Features for <span className="gradient-text">Modern Users</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Everything you need to manage your digital services efficiently and securely.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <Card key={index} className="glass-card hover:scale-105 transition-transform duration-300">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};
